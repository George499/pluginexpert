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
      // www -> без-www (301). Обе версии обслуживались одним Next.js-процессом без
      // редиректа, из-за чего Google считал главную дублем www-версии и выбирал
      // www каноническим, игнорируя <link canonical>. Хост-условие ловит www.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.pluginexpert.ru" }],
        destination: "https://pluginexpert.ru/:path*",
        permanent: true,
      },
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