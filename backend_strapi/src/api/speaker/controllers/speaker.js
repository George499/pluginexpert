'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::speaker.speaker', ({ strapi }) => ({

  async createAndLink(ctx) {
    const { data: rawData } = ctx.request.body || {};
    const userId = ctx.state.user?.id;

    if (!userId) {
      return ctx.unauthorized("Не авторизован");
    }

    const existingSpeaker = await strapi.entityService.findMany('api::speaker.speaker', {
      filters: { users_permissions_user: userId },
    });

    if (existingSpeaker && existingSpeaker.length > 0) {
      return ctx.badRequest('У пользователя уже есть профиль спикера');
    }

    const sanitized = (function stripUserId(obj) {
      if (obj === null || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(stripUserId);
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([key]) => key !== 'userId' && key !== 'users_permissions_user')
          .map(([key, val]) => [key, stripUserId(val)])
      );
    })(rawData || {});

    const createdSpeaker = await strapi.entityService.create('api::speaker.speaker', {
      data: sanitized,
    });

    await strapi.entityService.update('api::speaker.speaker', createdSpeaker.id, {
      data: { users_permissions_user: userId },
    });

    const linked = await strapi.entityService.findOne('api::speaker.speaker', createdSpeaker.id);
    return linked;
  },

  async updateByDocumentId(ctx) {
    const { documentId } = ctx.params;
    const { data } = ctx.request.body;

    try {
      // Найти спикера по documentId
      const entries = await strapi.entityService.findMany('api::speaker.speaker', {
        filters: { documentId },
      });

      if (!entries || entries.length === 0) {
        return ctx.notFound('Спикер с таким documentId не найден');
      }

      const entry = entries[0];

      // Обновить по id
      const updated = await strapi.entityService.update('api::speaker.speaker', entry.id, {
        data,
      });

      return updated;
    } catch (err) {
      console.error('Ошибка при обновлении спикера по documentId:', err);
      return ctx.internalServerError('Ошибка при обновлении');
    }
  }

}));
