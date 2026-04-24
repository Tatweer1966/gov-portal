'use strict';

module.exports = {
  async find(ctx) {
    return await strapi.entityService.findMany('api::news-article.news-article', {
      populate: '*',
      ...ctx.query,
    });
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    return await strapi.entityService.findOne('api::news-article.news-article', id, {
      populate: '*',
    });
  },
};
