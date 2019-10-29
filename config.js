// exports.Expires = {
//     maxAge: 60 * 60 * 24 * 365,
//     fileMatch: /^(gif|png|jpg|js|css)$/ig, // //ig 正则表达式全局匹配 
// }

const expires = {
    maxAge: 60 * 60,
    fileMatch: /^(gif|png|jpg|js|css)$/ig,
}

module.exports = expires;