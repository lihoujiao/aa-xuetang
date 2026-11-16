import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  devIndicators: false,
  generateBuildId: async () => "aa-xuetang",
};

export default nextConfig;
