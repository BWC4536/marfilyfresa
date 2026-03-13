/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Esto evita que el build falle por errores de linting
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'tu-proyecto-id.supabase.co' },
    ],
  },
};

export default nextConfig;
