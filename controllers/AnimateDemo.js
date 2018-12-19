module.exports = {
  'GET /animateDemo': async (ctx,next) => {
      ctx.render('animateDemo.html',{
          title: '运动demo'
      });
  }
};