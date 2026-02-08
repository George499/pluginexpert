'use strict';

/**
 * Extend users-permissions: override "me" to populate speaker with avatar, gallery, categories
 * so the dashboard loads profile data after re-login.
 */
module.exports = (plugin) => {
  const originalMe = plugin.controllers.user.me;

  plugin.controllers.user.me = async (ctx) => {
    const authUser = ctx.state.user;
    if (!authUser) {
      return ctx.unauthorized();
    }

    try {
      const user = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        authUser.id,
        {
          populate: {
            speaker: {
              populate: {
                avatar: true,
                gallery: true,
                categories: true,
              },
            },
          },
        }
      );

      if (!user) {
        return ctx.notFound();
      }

      const schema = strapi.getModel('plugin::users-permissions.user');
      const sanitized = await strapi.contentAPI.sanitize.output(user, schema, {
        auth: ctx.state.auth,
      });

      ctx.body = sanitized;
    } catch (err) {
      strapi.log.error('users-permissions me (extended):', err);
      return ctx.internalServerError();
    }
  };

  return plugin;
};
