import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  output: 'export', 
  distDir: 'build',
  turbopack: {
    resolveAlias: {
      // react-map-interaction's UMD bundle has an AMD branch that requires "React"
      React: 'react',
    },
  },
}
 
export default nextConfig