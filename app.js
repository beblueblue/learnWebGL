/*  模块化代码  */

//导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示：
const Koa = require('koa');

//引入"koa-bodyparser":
const bodyParser = require('koa-bodyparser');

//导入controller middleware:
const controller = require('./controller');


//导入templating middleware;
const templating = require('./templating');

//创建一个Koa对象表示web app本身
const app = new Koa();

//引入一个isProduction常量，判断当前环境是否为生产环境
const isProduction = process.env.NODE_ENV === 'production';

//打印日志 log request URL:
app.use(async(ctx,next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var 
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Respsonse-Time', '${execTime}ms');
});

//增加环境变量，提高生产效率：static file support
if(! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

//增加koa-bodyparser中间件: parse request body
app.use(bodyParser());

/*
//增加static-files中间件：
app.use(staticFiles());
*/

//add nunjucks as view:
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

//使用controller middleware: add controller
app.use(controller());

//在端口3000监听：
app.listen(3000);
console.log('app started at port 3000...');