import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let's not use regex for allowedDevOrigins
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
  ],
};

export default nextConfig;
