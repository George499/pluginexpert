'use strict';

module.exports = {
  register() {},

  bootstrap({ strapi }) {
    // Запуск ежедневной крон-задачи
    strapi.cron.add({
      // Каждый день в 3:00 утра
      '0 3 * * *': async () => {
        strapi.log.info('🕓 Запуск задачи сброса просроченных подписок...');

        try {
          // Получаем всех спикеров с истекшей подпиской
          const expiredSpeakers = await strapi.entityService.findMany('api::speaker.speaker', {
            filters: {
              subscriptionExpiresAt: {
                $lt: new Date().toISOString(),
              },
              isPaid: true,
            },
            limit: 1000, // безопасный лимит
          });

          strapi.log.info(`Найдено ${expiredSpeakers.length} спикеров с истекшей подпиской`);

          // Обновляем каждого из них
          for (const speaker of expiredSpeakers) {
            await strapi.entityService.update('api::speaker.speaker', speaker.id, {
              data: {
                isPaid: false,
              },
            });
            strapi.log.info(`⏳ Подписка сброшена для спикера ID ${speaker.id}`);
          }

          strapi.log.info('✅ Задача завершена успешно');
        } catch (err) {
          strapi.log.error('❌ Ошибка при сбросе подписок:', err);
        }
      }
    });
  },
};
