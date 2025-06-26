/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = withBundleAnalyzerConfig({
  crossOrigin: 'anonymous',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-d4510ea23efe4dfda8bbe952a1118ca5.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      }
    ],
  },
  logging:{
    fetches:{
      fullUrl:true
    }
  },
    turbopack: {
    // ...
  },
  experimental:{
    typedRoutes:true,
    optimizePackageImports:['@radix-ui/react-dropdown-menu','@radix-ui/react-icons','@radix-ui/react-label','@radix-ui/react-slot','@hookform/resolvers','react-hook-form','@tremor/react'],
  }
})

export default nextConfig
