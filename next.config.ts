import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: {
      exclude: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["error", "warn", "log"],
    },
  },
  experimental: {
    globalNotFound: true,
  },
  headers: async () => {
    return [
      {
        source: "/:path*\\.css",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000",
          },
        ],
      },
      {
        source: "/:path*\\.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000",
          },
        ],
      },
      {
        source: "/api/packages/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600",
          },
        ],
      },
      {
        source: "/api/github/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
