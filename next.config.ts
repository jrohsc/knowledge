import type { NextConfig } from "next";
// Empty string supports root hosting; default matches the GitHub project site.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/knowledge";
const config: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};
export default config;
