// Import necessary modules and plugins
import CopyPlugin from "copy-webpack-plugin";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants.js";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import createWithPWA from "@ducanh2912/next-pwa";

// Define your next.js configuration
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, {}) => {
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.fallback = { fs: false };

    config.plugins.push(
      new NodePolyfillPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm.wasm",
            to: "static/chunks/pages",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
            to: "static/chunks/pages",
          },
          {
            from: "./models",
            to: "static/chunks/pages",
          },
        ],
      })
    );

    return config;
  },
};

// Function to apply the PWA configuration based on the build phase
const nextConfigFunction = async (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withPWA = createWithPWA({
      dest: "public",
      cacheOnFrontEndNav: true,
      aggressiveFrontEndNavCaching: true,
      reloadOnOnline: true,
      swcMinify: true,
      disable: false,
      workboxOptions: {
        disableDevLogs: true,
      },
    });
    return withPWA(nextConfig);
  }
  return nextConfig;
};

// Export the configuration function
export default nextConfigFunction;
