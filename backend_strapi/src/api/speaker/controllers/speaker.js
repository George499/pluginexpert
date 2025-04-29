'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::speaker.speaker', ({ strapi }) => ({

  async createAndLink(ctx) {
    const { data } = ctx.request.body;
    const userId = ctx.state.user.id;

    if (!userId) {
      return ctx.unauthorized("Не авторизован");
    }

    // Проверяем: нет ли уже спикера для этого пользователя
    const existingSpeaker = await strapi.entityService.findMany('api::speaker.speaker', {
      filters: { userId },
    });

    if (existingSpeaker.length > 0) {
      return ctx.badRequest('У пользователя уже есть профиль спикера');
    }

    // Создаем нового спикера
    const createdSpeaker = await strapi.entityService.create('api::speaker.speaker', {
      data: {
        ...data,
        userId: userId,
      },
    });

    return createdSpeaker;
  }

}));
