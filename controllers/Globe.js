module.exports = {
  'GET /globe': async (ctx,next) => {
      ctx.render('globe.html',{
          title: '简单球体'
      });
  }
};