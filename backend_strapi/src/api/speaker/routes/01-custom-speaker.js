'use strict';

/** @type {import('@strapi/strapi').Core.RouterConfig} */
module.exports = {
  type: 'content-api',
  routes: [
    {
      method: "PUT",
      path: "/speakers/:id",
      handler: "api::speaker.speaker.update", 
    },
  ],
};
