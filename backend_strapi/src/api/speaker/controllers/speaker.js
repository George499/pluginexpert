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

    // Двухшаговое создание: сначала спикер, потом привязка к юзеру.
    // strapi.documents() корректно работает с черновиками — entityService.findOne не возвращал бы только что созданный draft.
    const created = await strapi.documents('api::speaker.speaker').create({
      data: sanitized,
      status: 'draft',
    });

    const linked = await strapi.documents('api::speaker.speaker').update({
      documentId: created.documentId,
      data: { users_permissions_user: userId },
      status: 'draft',
    });

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
      // strapi.documents() корректно работает и с черновиками, и с опубликованными — в отличие от entityService.findMany.
      const entry = await strapi.documents('api::speaker.speaker').findOne({
        documentId,
        populate: ['users_permissions_user'],
        status: 'draft',
      });

      if (!entry) {
        return ctx.notFound('Спикер с таким documentId не найден');
      }

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

      const updated = await strapi.documents('api::speaker.speaker').update({
        documentId,
        data: sanitized,
      });

      return updated;
    } catch (err) {
      console.error('Ошибка при обновлении спикера по documentId:', err);
      return ctx.internalServerError('Ошибка при обновлении');
    }
  }

}));
