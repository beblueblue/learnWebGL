module.exports = {
  'GET /line': async (ctx,next) => {
      ctx.render('line.html',{
          title: '绘制线'
      });
  }
};