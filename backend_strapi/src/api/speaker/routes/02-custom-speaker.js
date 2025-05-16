'use strict';

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/speakers/create-and-link",
      handler: "api::speaker.speaker.createAndLink",
      
    },
  ],
};
