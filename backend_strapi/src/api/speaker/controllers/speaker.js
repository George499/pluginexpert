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

    // Поля, которые клиент не имеет права задавать при создании.
    // isPaid и связанные с подпиской выставляются только webhook оплаты или админом через Strapi Admin.
    const FORBIDDEN_KEYS = new Set([
      'userId',
      'users_permissions_user',
      'isPaid',
      'subscriptionExpiresAt',
      'lastPaymentDate',
      'lastPaymentAmount',
      'lastPaymentId',
    ]);
    const sanitized = (function strip(obj) {
      if (obj === null || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(strip);
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([key]) => !FORBIDDEN_KEYS.has(key))
          .map(([key, val]) => [key, strip(val)])
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
    const { data } = ctx.request.body || {};
    const userId = ctx.state.user?.id;

    if (!userId) {
      return ctx.unauthorized('Не авторизован');
    }

    try {
      const entries = await strapi.entityService.findMany('api::speaker.speaker', {
        filters: { documentId },
        populate: ['users_permissions_user'],
      });

      if (!entries || entries.length === 0) {
        return ctx.notFound('Спикер с таким documentId не найден');
      }

      const entry = entries[0];

      if (entry.users_permissions_user?.id !== userId) {
        return ctx.forbidden('Нет прав на редактирование этой анкеты');
      }

      // Поля, которые меняются только сервером (webhook оплаты или админ через Strapi Admin Panel)
      const PROTECTED_FIELDS = [
        'isPaid',
        'subscriptionExpiresAt',
        'lastPaymentDate',
        'lastPaymentAmount',
        'lastPaymentId',
        'users_permissions_user',
        'userId',
      ];
      const sanitized = Object.fromEntries(
        Object.entries(data || {}).filter(([key]) => !PROTECTED_FIELDS.includes(key))
      );

      const updated = await strapi.entityService.update('api::speaker.speaker', entry.id, {
        data: sanitized,
      });

      return updated;
    } catch (err) {
      console.error('Ошибка при обновлении спикера по documentId:', err);
      return ctx.internalServerError('Ошибка при обновлении');
    }
  }

}));
