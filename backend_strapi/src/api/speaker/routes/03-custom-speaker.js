'use strict';

module.exports = {
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
