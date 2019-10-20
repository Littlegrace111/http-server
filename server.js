var http = require('http');
var PORT = 8000;
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('./mime');
var expireConfig = require('./config');

var server = http.createServer(function(request, response) {
    console.log('================================');
    // 1. 获取url域名后面的文件路径
    var pathname = url.parse(request.url).pathname;
    console.log('pathname=', pathname); 
    // 2. 指定静态资源服务器根目录与url获取到的相对路径进行拼接
    var realpath = 'assets' + pathname; 
    console.log('realpath=', realpath);
    // 3. 提取文件后缀名，解析文件类型
    var ext = path.extname(realpath); // 取文件后缀名
    console.log('ext=', ext); 
    ext = ext ? ext.slice(1) : 'unknown';
    // 4. 依据文件类型，匹配Content-Type
    var contentType = mime[ext] || 'text/plain';
    // 5. 匹配过期时间规则
    console.log('expireConfig=', expireConfig);
    if (ext.match(expireConfig.fileMatch)) {
        var currentTime = new Date();
        var expireTime = new Date();
        expireTime.setTime(currentTime.getTime() + expireConfig.maxAge * 1000);
        response.setHeader('Expires', expireTime.toUTCString()); // UTCString 返回世界时间编码格式
        response.setHeader('Cache-Control', "max-age=" + expireConfig.maxAge);
    }
    
    fs.exists(realpath, function(exists) {
        if(!exists) {
            response.writeHead(404, {
                'Content-Type': contentType
            });
            response.write('This request url ' + pathname + 'was not find');
            response.end();
        } else {
            fs.readFile(realpath, 'binary', function(err, file) {
                console.log('err', err);
                if(err) {
                    response.writeHead(500, {
                        'Content-Type': contentType
                    })
                    response.end()
                } else {
                    // Content-Type : 格式要写对，如果使用text/plain 去解析图片，浏览器是乱码
                    response.writeHead(200, {
                        'Content-Type': contentType
                    })
                    response.write(file, 'binary');
                    response.end()
                }
            })
        }
    }) 
    // response.write(pathname);
    // response.end(); // 如果不加response.end() 浏览器会一直loading，因为不知道什么时候响应完成
})

server.listen(PORT);
console.log('server running at port ', PORT);