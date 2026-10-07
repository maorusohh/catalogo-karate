import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  adapterPath: path.resolve(process.cwd(), "build/next-static-export-adapter.cjs"),
};

export default nextConfig;
