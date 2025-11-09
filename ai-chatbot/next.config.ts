import type { NextConfig } from "next";

const nextConfig: NextConfig & { swcMinify?: boolean } = {
   reactStrictMode: true,  // Enables React's Strict Mode for better debugging
  swcMinify: true,   
};

export default nextConfig;
