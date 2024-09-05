/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: "./",
  pageExtensions: ["page.tsx", "page.ts"],
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  webpack: (config, { isServer }) => {
    config.experiments = {
      asyncWebAssembly: true,
    };
    config.output.webassemblyModuleFilename =
      (isServer ? "../" : "") + "static/wasm/webassembly.wasm";
    return config;
  },
};
