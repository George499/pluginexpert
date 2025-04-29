'use strict';

module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/speakers/:id",
      handler: "api::speaker.speaker.update", 
    },
  ],
};
