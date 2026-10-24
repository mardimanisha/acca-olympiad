import type { NextConfig } from "next";

const BASE_PATH = "/National-Commerce-Olympiad-2026";

// Static files load straight from this project's own domain, not through the proxies on zskillup.com and
// acca-zskillup.vercel.app: their CDNs cached partial (range) responses of images and video for everyone.
const ASSET_URL =
  process.env.NODE_ENV === "production" ? `https://acca-olympiad.vercel.app${BASE_PATH}` : BASE_PATH;

const nextConfig: NextConfig = {
  assetPrefix: ASSET_URL,
  // Served from acca-zskillup.vercel.app/National-Commerce-Olympiad-2026 via a rewrite in the main site.
  basePath: BASE_PATH,
  images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
  async headers() {
    return [
      {
        // Static files in /public are cached for a week so repeat visits don't re-download them.
        source: "/:file(.*\.(?:jpg|jpeg|png|webp|svg|mp4|ico))",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH, NEXT_PUBLIC_ASSET_URL: ASSET_URL },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
