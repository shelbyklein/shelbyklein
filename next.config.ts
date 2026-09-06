import type { NextConfig } from 'next';

const githubPages = process.env.GITHUB_PAGES === 'true';
const basePath = githubPages ? (process.env.GITHUB_PAGES_BASE_PATH ?? '') : '';
const nextConfig: NextConfig = {
  // Vinext's exporter renders unprefixed routes. Prefix emitted assets here and
  // use sitePath() for links, keeping static output portable under Pages.
  ...(githubPages ? {
    output: 'export',
    assetPrefix: basePath,
  } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: String(githubPages),
  },
};

export default nextConfig;
