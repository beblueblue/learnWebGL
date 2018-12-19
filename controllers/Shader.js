module.exports = {
  'GET /shader': async (ctx,next) => {
      ctx.render('shader.html',{
          title: '着色器demo'
      });
  }
};