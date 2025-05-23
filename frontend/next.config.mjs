/** @type {import('next').NextConfig} */
const nextConfig = {
  // Сохраняем существующие настройки для изображений
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
};

export default nextConfig;