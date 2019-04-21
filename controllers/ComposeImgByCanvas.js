module.exports = {
  'GET /composeImgByCanvas': async (ctx,next) => {
      ctx.render('composeImgByCanvas.html',{
          title: '利用canvas合成图片'
      });
  }
};