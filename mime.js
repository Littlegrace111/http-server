const mime = {
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'json': 'application/json',
    'html': 'text/html;charset=utf-8', //不加charset=utf-8 html中的中文显示乱码
}

module.exports = mime;


// exports.types = {
//     'jpg': 'image/jpeg',
//     'png': 'image/png',
//     'json': 'application'
// }