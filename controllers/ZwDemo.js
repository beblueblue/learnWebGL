module.exports = {
    'GET /zwDemo': async (ctx,next) => {
        ctx.render('zwDemo.html',{
            title: '3D预览demo'
        });
    }
  };