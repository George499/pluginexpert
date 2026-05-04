'use strict';

const ALLOWED_REF = 'api::speaker.speaker';
const ALLOWED_FIELDS = new Set(['avatar', 'gallery']);

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.method !== 'POST' || ctx.path !== '/api/upload') {
      return next();
    }

    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized('Не авторизован');

    const fileId = ctx.query?.id;
    const body = ctx.request.body || {};
    const ref = body.ref;
    const refId = body.refId;
    const field = body.field;

    if (fileId) {
      const file = await strapi.db.query('plugin::upload.file').findOne({
        where: { id: fileId },
        populate: ['related'],
      });
      if (!file) return ctx.notFound('Файл не найден');

      const related = file.related || [];
      if (related.length === 0) {
        return ctx.forbidden('Замена непривязанных файлов запрещена');
      }
      const ownership = await Promise.all(
        related.map(async (r) => {
          if (r.__type !== ALLOWED_REF) return false;
          const speaker = await strapi.entityService.findOne(r.__type, r.id, {
            populate: ['users_permissions_user'],
          });
          return speaker?.users_permissions_user?.id === userId;
        })
      );
      if (!ownership.every(Boolean)) {
        return ctx.forbidden('Нет прав на замену этого файла');
      }
      return next();
    }

    if (ref && refId) {
      if (ref !== ALLOWED_REF) {
        return ctx.forbidden('Тип контента запрещён для загрузки');
      }
      if (!ALLOWED_FIELDS.has(field)) {
        return ctx.forbidden('Это поле недоступно для загрузки');
      }
      const speaker = await strapi.entityService.findOne(ref, refId, {
        populate: ['users_permissions_user'],
      });
      if (!speaker) return ctx.notFound('Спикер не найден');
      if (speaker.users_permissions_user?.id !== userId) {
        return ctx.forbidden('Нет прав на загрузку в этот профиль');
      }
      return next();
    }

    return ctx.forbidden('Загрузка без привязки к профилю запрещена');
  };
};
