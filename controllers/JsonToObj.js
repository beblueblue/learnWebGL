module.exports = {
    'GET /jsonToObj': async (ctx,next) => {
        ctx.render('jsonToObj.html',{
            title: 'json模型转为obj模型'
        });
    }
  };