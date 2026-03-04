import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['shared'],
  webpack(config) {
    config.resolve.alias['@shared'] = path.resolve(__dirname, '../shared')
    // Ensure shared/ code resolves deps (like zod) from dashboard's node_modules
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      ...(config.resolve.modules || ['node_modules']),
    ]
    return config
  },
};

export default nextConfig;
