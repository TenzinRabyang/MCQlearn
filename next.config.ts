import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "run-agent-6a54c6bd3fce2ced9c5c5fe3-mrj4ahzo-preview.agent-sandbox-my-b1-gw.trae.ai",
    "run-agent-6a54c6bd3fce2ced9c5c5fe3-mrj4ahzo.remote-agent.svc.cluster.local"
  ],
};

export default nextConfig;
