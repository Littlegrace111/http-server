# http-server
从代码深刻了解http的协议细节

## Http 缓存
1. 强缓存策略：cache-control, expires;
2. 协商缓存策略: last-modified, if-modified-since, etag;

## 浏览器缓存
1. nodemon node.js应用程序在开发环境的守护进程，比supervisor好用，可以实现文件hotload；
2. service worker demo 采用service worker来代理页面所有静态文件的更新；
3. google workbox是service worker的预生成器；