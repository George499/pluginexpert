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
  
  // Добавляем настройки для source maps
  productionBrowserSourceMaps: false, // Отключаем source maps в production для уменьшения размера бандла
  
  // Опционально: настройка webpack для более точного контроля source maps
  webpack: (config, { dev, isServer }) => {
    // В режиме разработки можно использовать более быстрые source maps
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
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