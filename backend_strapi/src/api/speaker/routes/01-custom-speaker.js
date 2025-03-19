'use strict';

module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/speakers/:id",
      handler: "speaker.update",
      config: {
        auth: { scope: "api::speakers.speaker" }, 
        policies: [],
      },
    },
  ],
};
