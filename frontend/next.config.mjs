/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.pluginexpert.ru",
        // Если вы хотите разрешить все пути, оставьте pathname: '/**'
        pathname: "/**",
      },
    ],
  },
};
export default nextConfig;
