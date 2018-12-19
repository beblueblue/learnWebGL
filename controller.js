const fs = require('fs');

//创建router的函数
function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            //如果url类似"GET xxx"
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            //如果url类似"POST xxx"
            var path = url.substring(5);
            router.post(path,mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            //无效的url
            console.log(`invalid URL: ${url}`);
        }
    }
}

//构建扫描controller目录的函数
function addControllers(router, dir) {
    //在node任何模块文件内部，可以使用__dirname变量获取当前模块文件所在目录的完整绝对路径
    fs.readdirSync(__dirname + '/' + dir).filter((f) => {
        return f.endsWith('.js');
    }).forEach((f) => {
        console.log(`process controller: ${f}...`);
        let mapping = require (__dirname + '/' + dir + '/' + f);
        addMapping(router, mapping);
    });
}

module.exports = function (dir) {
    let
        controller_dir = dir || 'controllers', //如果不传入参数，扫描目录默认为'controllers'
        router = require('koa-router')();
    addControllers(router, controller_dir);
    return router.routes();
};