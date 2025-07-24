import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: {
      exclude: ["error", "warn"],
    },
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
