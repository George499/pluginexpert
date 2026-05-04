module.exports = ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: env.array('CORS_ORIGINS', [
        'https://pluginexpert.ru',
        'https://www.pluginexpert.ru',
        'http://localhost:3000',
      ]),
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'global::upload-ownership',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
