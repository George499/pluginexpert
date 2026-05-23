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
      // Дубли блога — канонические URL подтверждены клиентом
      {
        source: "/blog/aktualnaya-baza-spikerov-s-ih-pryamymi-kontaktami-2025g",
        destination: "/blog/aktualnaya-baza-spikerov-s-ih-pryamymi-kontaktami-2025-godu",
        permanent: true,
      },
      {
        source: "/blog/kak-stat-spikerom",
        destination: "/blog/kak-stat-spikerom-vash-put-k-sczene-i-uspehu",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;