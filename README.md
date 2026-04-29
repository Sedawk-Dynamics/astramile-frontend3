# AstraMile — Frontend

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 site for AstraMile. Includes the public marketing site and the `/admin` panel that talks to the [backend API](../backend/README.md).

---

## Table of contents

1. [Architecture](#1-architecture)
2. [Prerequisites](#2-prerequisites)
3. [Local setup](#3-local-setup)
4. [Environment variables](#4-environment-variables)
5. [Scripts](#5-scripts)
6. [Building for production](#6-building-for-production)
7. [Deployment guide](#7-deployment-guide)
   - [Vercel (recommended)](#71-vercel-recommended)
   - [Generic Linux VM (Node + PM2 / systemd)](#72-generic-linux-vm-node--pm2--systemd)
   - [Docker](#73-docker)
   - [Static export (not supported)](#74-static-export-not-supported)
   - [Render / Railway / Fly.io / Netlify](#75-render--railway--flyio--netlify)
   - [Windows Server](#76-windows-server)
8. [Reverse proxy (Nginx)](#8-reverse-proxy-nginx)
9. [Domains, HTTPS & CORS](#9-domains-https--cors)
10. [Image domains](#10-image-domains)
11. [Updating in production](#11-updating-in-production)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Architecture

```
frontend/
├── public/                    # Static assets served at /
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Homepage
│   │   ├── about/, blog/, contact/, gallery/, launches/, missions/, news/, rockets/, team/, technology/
│   │   └── admin/             # Admin panel — talks to /api/*
│   ├── components/
│   └── lib/
│       └── publicApi.ts       # Wraps fetch + `NEXT_PUBLIC_API_BASE`
├── next.config.ts             # Image remotePatterns derived from API base
├── package.json
└── tsconfig.json
```

Pages render server-side at request time (no `output: 'export'`), so you need a Node runtime in production. The frontend is **stateless** — every dynamic value comes from the backend API at `NEXT_PUBLIC_API_BASE`.

---

## 2. Prerequisites

- **Node.js 18.18+** (20 LTS recommended — Next 16 requires modern Node)
- **npm 9+**
- The [backend API](../backend/README.md) running and reachable from both the build environment and end-user browsers

Verify:

```bash
node -v        # v20.x
npm -v
```

---

## 3. Local setup

```bash
cd frontend
npm install
cp .env.local.example .env.local        # then edit
npm run dev                              # http://localhost:3000
```

Make sure the backend is running on `http://localhost:4000` (or whatever you put in `NEXT_PUBLIC_API_BASE`) **before** starting `npm run dev`. The admin login lives at <http://localhost:3000/admin/login>.

---

## 4. Environment variables

The frontend reads exactly one variable. Anything prefixed `NEXT_PUBLIC_` is **inlined into the browser bundle at build time**, so you must rebuild whenever it changes.

| Variable | Required | Default | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE` | yes | `http://localhost:4000` | Base URL of the backend, **no trailing slash** |

`.env.local` (development):

```env
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

`.env.production` / production host:

```env
NEXT_PUBLIC_API_BASE=https://api.astramile.com
```

> The value also drives `next.config.ts` → `images.remotePatterns`, so the API host is automatically allowed for `next/image`. If you change the API host, **rebuild**.

---

## 5. Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR on `:3000` |
| `npm run build` | Production build → `.next/` |
| `npm start` | Serve the production build (needs `npm run build` first) |
| `npm run lint` | ESLint (`eslint-config-next`) |

---

## 6. Building for production

```bash
npm ci
NEXT_PUBLIC_API_BASE=https://api.astramile.com npm run build
npm start              # listens on $PORT (default 3000)
```

The `.next/` folder, `public/`, `package.json`, and `node_modules/` are everything the runtime needs. You can prune dev deps after the build (`npm prune --omit=dev`) if image size matters.

> **Important**: `NEXT_PUBLIC_API_BASE` must be set **at build time**, not just at runtime, because Next inlines it into the client bundle. Setting it only on the server has no effect on the browser code.

---

## 7. Deployment guide

### 7.1 Vercel (recommended)

1. Push the repo to GitHub/GitLab/Bitbucket.
2. In Vercel: **New Project** → import the repo → set the **root directory** to `frontend/`.
3. Build settings (auto-detected for Next.js):
   - **Build command**: `npm run build`
   - **Output**: `.next` (managed by Vercel)
   - **Install**: `npm ci`
4. Environment variables → add `NEXT_PUBLIC_API_BASE=https://api.astramile.com` for **Production** (and `Preview`/`Development` as needed).
5. Deploy. Add a custom domain under **Settings → Domains**.

After changing `NEXT_PUBLIC_API_BASE` you must **redeploy** — the value is baked into the client bundle.

### 7.2 Generic Linux VM (Node + PM2 / systemd)

```bash
# One-time host setup
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo useradd -r -m -s /bin/bash astramile
```

Deploy:

```bash
sudo -u astramile -H bash <<'EOF'
cd ~
git clone <repo> app
cd app/frontend
npm ci
echo "NEXT_PUBLIC_API_BASE=https://api.astramile.com" > .env.production
npm run build
EOF
```

#### systemd service

`/etc/systemd/system/astramile-web.service`:

```ini
[Unit]
Description=AstraMile Web (Next.js)
After=network.target

[Service]
Type=simple
User=astramile
WorkingDirectory=/home/astramile/app/frontend
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=NEXT_PUBLIC_API_BASE=https://api.astramile.com
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now astramile-web
journalctl -u astramile-web -f
```

#### PM2 alternative

```bash
sudo npm i -g pm2
pm2 start npm --name astramile-web --cwd /home/astramile/app/frontend -- start
pm2 save
pm2 startup systemd
```

### 7.3 Docker

#### Dockerfile

```dockerfile
# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_BASE=http://localhost:4000
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- run ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.ts ./
RUN npm ci --omit=dev && npm cache clean --force
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t astramile-web \
  --build-arg NEXT_PUBLIC_API_BASE=https://api.astramile.com \
  .
docker run -d --name astramile-web -p 3000:3000 astramile-web
```

#### docker-compose snippet (alongside the API)

```yaml
  web:
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_API_BASE: https://api.astramile.com
    restart: unless-stopped
    depends_on: [api]
    ports:
      - "3000:3000"
```

> If the API is reachable as `http://api:4000` *inside* the Docker network, you still need `NEXT_PUBLIC_API_BASE` to be the **public** URL the browser will use — not the internal one.

### 7.4 Static export (not supported)

Don't use `output: "export"`. The admin panel uses client-side fetches with auth, and `next/image` runs through the Next image optimizer. Keep the Node runtime.

### 7.5 Render / Railway / Fly.io / Netlify

- **Build command**: `npm ci && npm run build`
- **Start command**: `npm start`
- **Node version**: 20
- **Env vars**: `NEXT_PUBLIC_API_BASE=https://api.astramile.com`

Render service example (`render.yaml`):

```yaml
services:
  - type: web
    name: astramile-web
    runtime: node
    plan: starter
    buildCommand: npm ci && npm run build
    startCommand: npm start
    envVars:
      - key: NEXT_PUBLIC_API_BASE
        value: https://api.astramile.com
      - key: NODE_ENV
        value: production
```

Netlify works via the official Next.js adapter, but Vercel remains the path of least resistance.

### 7.6 Windows Server

```powershell
cd C:\apps\astramile\frontend
npm ci
"NEXT_PUBLIC_API_BASE=https://api.astramile.com" | Out-File -Encoding ascii .env.production
npm run build
```

Run as a service via [NSSM](https://nssm.cc/):

```cmd
nssm install AstramileWeb "C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" start
nssm set AstramileWeb AppDirectory "C:\apps\astramile\frontend"
nssm set AstramileWeb AppEnvironmentExtra NODE_ENV=production PORT=3000 NEXT_PUBLIC_API_BASE=https://api.astramile.com
nssm start AstramileWeb
```

---

## 8. Reverse proxy (Nginx)

`/etc/nginx/sites-available/astramile-web`:

```nginx
server {
  listen 80;
  server_name astramile.com www.astramile.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name astramile.com www.astramile.com;

  ssl_certificate     /etc/letsencrypt/live/astramile.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/astramile.com/privkey.pem;

  # Long cache for the immutable bundle
  location /_next/static/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_cache_valid 200 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    proxy_pass         http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/astramile-web /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d astramile.com -d www.astramile.com
```

---

## 9. Domains, HTTPS & CORS

Two-host layout (recommended):

| Host | Serves |
|---|---|
| `https://astramile.com` | Next.js frontend |
| `https://api.astramile.com` | Express backend |

On the **backend**, set `CORS_ORIGIN=https://astramile.com,https://www.astramile.com`. On the **frontend**, set `NEXT_PUBLIC_API_BASE=https://api.astramile.com` and rebuild.

If you'd rather keep one host (`/api/*` proxied to the backend), point `NEXT_PUBLIC_API_BASE=https://astramile.com` and have Nginx forward `/api/*` and `/uploads/*` to the backend's `:4000`.

---

## 10. Image domains

`next.config.ts` derives `images.remotePatterns` from `NEXT_PUBLIC_API_BASE` and pre-allows Unsplash + Pixabay. If you serve images from another host, edit `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "cdn.pixabay.com" },
    { protocol: "https", hostname: "cdn.astramile.com" },
    // …
  ],
}
```

---

## 11. Updating in production

```bash
sudo -u astramile -H bash <<'EOF'
cd ~/app
git pull
cd frontend
npm ci
npm run build
EOF
sudo systemctl restart astramile-web
```

For zero-downtime, run two instances behind Nginx and restart them one at a time, or rely on your platform's blue-green deploys (Vercel, Render, etc. handle this for you).

---

## 12. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| API calls fail with `Failed to fetch` from the browser | Browser can't reach `NEXT_PUBLIC_API_BASE`, or CORS rejects the origin | Open the URL directly; check backend `CORS_ORIGIN` includes the site origin |
| Images render as broken icons | Image host not in `remotePatterns` | Add it to `next.config.ts`, rebuild |
| Admin login succeeds but every API call is 401 | JWT token tied to a different `JWT_SECRET`, or stored token expired | Sign out and back in; ensure backend `JWT_SECRET` is stable across deploys |
| Site loads but pages 404 in production | Build was skipped or stale | Re-run `npm ci && npm run build`, restart |
| Env var change had no effect | `NEXT_PUBLIC_*` is baked at build time | Rebuild after changing `NEXT_PUBLIC_API_BASE` |
| `Error: ENOSPC` building on a small VM | Out of file watchers / disk | `sudo sysctl -w fs.inotify.max_user_watches=524288`; free disk |
| Mixed-content warnings in production | Frontend on HTTPS, API on HTTP | Put the API behind HTTPS too (see backend README §11) |
| `npm start` exits immediately | `.next/` missing | Run `npm run build` first |

---

## License

Proprietary — © AstraMile.
