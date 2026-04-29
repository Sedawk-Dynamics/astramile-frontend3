import type { NextConfig } from "next";

const apiBase = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000").replace(/\/$/, "");
const apiUrl = new URL(apiBase);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port || undefined,
        pathname: "/uploads/**",
      },
    ],
  },
  // Proxy /uploads/* to the backend so admin-uploaded images appear same-origin
  // to the frontend. This sidesteps cross-origin image-optimization issues with
  // next/image (port mismatches, hosts that change between dev and prod, helmet
  // headers, etc.) and lets us pass the bare path "/uploads/foo.jpg" to <Image>.
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${apiBase}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
