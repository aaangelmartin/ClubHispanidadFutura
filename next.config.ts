import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NEXT_DIST_DIR permite varios servidores de desarrollo a la vez sin pisarse la carpeta .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
