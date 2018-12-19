module.exports = {
  'GET /pullinModel': async (ctx,next) => {
      ctx.render('pullinModel.html',{
          title: '3D预览之模型引入'
      });
  }
};