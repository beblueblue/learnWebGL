module.exports = {
    'GET /zwPreviewImg': async (ctx,next) => {
        ctx.render('zwPreviewImg.html',{
            title: '效果图细节研究'
        });
    }
  };