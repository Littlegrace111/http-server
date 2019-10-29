const VERSION = 'v2';
const CACHE_NAME = 'service-worker-demo-' + VERSION;

console.log('service worker begin');

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
            console.log(err);
        })
    )
});

this.addEventListener('activate', function (event) {
    console.log('activate serviceWorker, event =', event);
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (CACHE_NAME.indexOf(key) === -1) {
                    console.log('key', key);
                    return caches.delete(key);
                }
            }))
        })
    )
});
// service worker 的fetch事件
this.addEventListener('fetch', function (event) {
    console.log(event.request);
    event.respondWith(
        caches.match(event.request).then(function (resp) {
            if (resp) {
                console.log(resp, event.request.url, '有缓存，从缓存中取');
                return resp;
            } else {
                console.log(resp, event.request.url, '没有缓存，网络获取');
                return fetch(event.request)
                    .then(function (response) {
                        return caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(event.request, response.clone());
                            return response;
                        })
                    })
            }
        })
    )
});
console.log('end');