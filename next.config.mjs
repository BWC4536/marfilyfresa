/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tu-proyecto-id.supabase.co', // RECUERDA CAMBIAR ESTO POR TU ID DE SUPABASE
      },
    ],
  },
};

export default nextConfig;