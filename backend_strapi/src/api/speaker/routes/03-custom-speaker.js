'use strict';

/** @type {import('@strapi/strapi').Core.RouterConfig} */
module.exports = {
  type: 'content-api',
  routes: [
    {
      method: "PUT",
      path: "/speakers/by-document/:documentId",
      handler: "api::speaker.speaker.updateByDocumentId",
      config: {
        auth: false // или true, если нужен токен
      }
    },
  ],
};
