'use strict';

module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/speakers/:id",
      handler: "speaker.update",
      
    },
  ],
};
