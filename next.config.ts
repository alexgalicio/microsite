import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uxtayxsrtiomdepijfhh.supabase.co",
        pathname: "/storage/v1/object/public/**", // supabase
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net", // facebook CDN
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // profile pictures
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
