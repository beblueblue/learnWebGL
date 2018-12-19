module.exports = {
  'GET /particle': async (ctx,next) => {
      ctx.render('particle.html',{
          title: '粒子系统'
      });
  }
};