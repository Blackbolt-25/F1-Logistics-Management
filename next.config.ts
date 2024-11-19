import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'creativereview.imgix.net',
          pathname: '/content/uploads/**',
        },
      ],
    },
    
  env: {
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
