/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'img.clerk.com',                 // Clerk-hosted avatars
      'lh3.googleusercontent.com',     // Google avatars
      'avatars.githubusercontent.com', // GitHub avatars
    ],
  },
};

export default nextConfig;
