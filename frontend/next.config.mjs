/** @type {import('next').NextConfig} */
const nextConfig = {
  // Сохраняем существующие настройки для изображений
  images: {
  unoptimized: true,
   remotePatterns: [
      { protocol: 'https', hostname: 'admin.pluginexpert.ru', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'pluginexpert.ru', pathname: '/uploads/**' },
    ],
  },
  
  productionBrowserSourceMaps: false,

   async redirects() {
    return [
      {
        source: "/speakers/blog",
        destination: "/blog",
        permanent: true, // 301 редирект
      },
    ];
  },
};

export default nextConfig;