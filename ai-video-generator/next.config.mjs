/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ this keeps API routes working!
  images: {
    domains: ["lh3.googleusercontent.com"],
    unoptimized: true,
  },
};

export default nextConfig;
