import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NEXT_DIST_DIR permite varios servidores de desarrollo a la vez sin pisarse la carpeta .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Rutas que la gente escribe a mano: llevan a la pantalla real en vez de dar 404.
  async redirects() {
    return [
      { source: "/feed", destination: "/estudiante", permanent: false },
      { source: "/inicio", destination: "/estudiante", permanent: false },
      { source: "/dashboard", destination: "/empresa", permanent: false },
      { source: "/terminal", destination: "/empresa", permanent: false },
      { source: "/login", destination: "/entrar", permanent: false },
    ];
  },
};

export default nextConfig;
