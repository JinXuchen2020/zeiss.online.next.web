/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Outputs a Single-Page Application (SPA).
  distDir: './dist', // Changes the build output directory to `./dist/`.
  images:{
    unoptimized: true, // Prevents Next.js from optimizing images.
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}
  
export default nextConfig