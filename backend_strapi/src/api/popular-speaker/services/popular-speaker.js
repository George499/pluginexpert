'use strict';

/**
 * popular-speaker service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::popular-speaker.popular-speaker');
