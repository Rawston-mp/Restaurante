import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilita output standalone para Docker
  output: process.env.DOCKER_BUILD === "1" ? "standalone" : undefined,

  // Permite imagens de qualquer domínio externo (para URLs de imagens)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
