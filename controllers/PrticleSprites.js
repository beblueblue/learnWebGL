module.exports = {
  'GET /particleSprites': async (ctx,next) => {
      ctx.render('particleSprites.html',{
          title: '粒子系统demo2'
      });
  }
};