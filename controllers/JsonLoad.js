module.exports = {
  'GET /jsonload': async (ctx,next) => {
      ctx.render('jsonload.html',{
          title: 'zakeke模型引入'
      });
  }
};