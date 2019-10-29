const VERSION = 'v3';
const CACHE_NAME = 'service-worker-demo-' + VERSION;

console.log('service worker begin');

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
if(workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

// 缓存文件
this.addEventListener('install', function (event) {
    console.log('install sw.js success, CACHE_NAME =', CACHE_NAME);
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                'getList',
                'img/react.png',
                'js/jquery_v1.js',
                'js/index_v1.js'
            ]);
        }).catch(function (err) {
            console.log('in service worker install event:', err);
        })
    )
});

// 缓存策略更新
this.addEventListener('activate', function (event) {
    console.log('activate serviceWorker, event =', event);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            console.log(cacheNames);
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 如果当前版本和缓存版本不一致
                    if (cacheName.indexOf(CACHE_NAME) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    )
});

// 捕获请求并返回缓存数据
this.addEventListener('fetch', function (event) {
    console.log(event.request);
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                console.log(event.request.url, response);
                return resp;
            } else {
                console.log(event.request.url, 'no cache');
                return fetch(event.request).then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                })
            }
        }).catch(() => {
            return fetch(event.request);
        })
    )
});
console.log('service worker end');