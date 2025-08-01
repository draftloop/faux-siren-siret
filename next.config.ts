import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'docs',
  basePath: '/faux-siren-siret',
  assetPrefix: '/faux-siren-siret'
};

export default nextConfig;
