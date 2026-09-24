import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep tracing scoped to this project (a lockfile also exists in the home dir).
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
