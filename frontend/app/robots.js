export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/auth/', '/payment-complete'],
    },
    sitemap: 'https://pluginexpert.ru/sitemap.xml',
  };
}
