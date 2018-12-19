module.exports = {
  'GET /viewModel': async (ctx,next) => {
      ctx.render('viewModel.html',{
          title: '3D预览之模型观察'
      });
  }
};