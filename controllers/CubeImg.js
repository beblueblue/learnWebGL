module.exports = {
  'GET /cubeImg': async (ctx,next) => {
      ctx.render('cubeImg.html',{
          title: '正方形贴图'
      });
  }
};