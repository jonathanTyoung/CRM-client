/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0, // never serve stale server-component pages from the router cache
    },
  },
};

export default nextConfig;
