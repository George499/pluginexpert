'use strict';

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/speakers/create-and-link",
      handler: "api::speaker.speaker.createAndLink",
      config: {
        policies: [],
        auth: true, // чтобы доступ был только для авторизованных
      },
    },
  ],
};
