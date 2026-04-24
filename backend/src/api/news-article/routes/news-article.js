module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/news-articles',
      handler: 'news-article.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/news-articles/:id',
      handler: 'news-article.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
