'use strict';

/** @type {import('@strapi/strapi').Core.RouterConfig} */
module.exports = {
  type: 'content-api',
  routes: [
    {
      method: "POST",
      path: "/speakers/create-and-link",
      handler: "api::speaker.speaker.createAndLink",
      
    },
  ],
};
