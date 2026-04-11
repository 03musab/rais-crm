import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  outputFileTracingRoot: __dirname,
  swcMinify: false,
  experimental: {
    swcPlugins: undefined,
  },
};

export default nextConfig;
