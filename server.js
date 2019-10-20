var http = require('http');
var PORT = 8000;
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('./mime.js');

var server = http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log('pathname: ', pathname);
    var realpath = 'assets' + pathname;
    var ext = path.extname(realpath); // 取文件后缀名
    console.log('ext', ext); 
    ext = ext ? ext.slice(1) : 'unknown';
    var contentType = mime[ext] || 'text/plain';

    console.log('realpath', realpath);
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