import type { NextConfig } from "next";

const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";
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
};

export default nextConfig;
