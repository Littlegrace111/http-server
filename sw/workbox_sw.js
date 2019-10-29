

self.addEventListener('error', function(e) {
    self.clients.matchAll()
      .then(function (clients) {
        if (clients && clients.length) {
          clients[0].postMessage({ 
            type: 'ERROR',
            msg: e.message || null,
            stack: e.error ? e.error.stack : null
          });
        }
      });
  });
  
  self.addEventListener('unhandledrejection', function(e) {
    self.clients.matchAll()
      .then(function (clients) {
        if (clients && clients.length) {
          clients[0].postMessage({
            type: 'REJECTION',
            msg: e.reason ? e.reason.message : null,
            stack: e.reason ? e.reason.stack : null
          });
        }
      });
  })
  
  importScripts('https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js');
  workbox.setConfig({
    debug: false,
    modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.3.0/'
  });
  workbox.skipWaiting();
  workbox.clientsClaim();
  
  var cacheList = [
    '/',
    '/tbhome/home-2017',
    '/tbhome/page/market-list'
  ];
  
  workbox.routing.registerRoute(
    function(event) {
      // 需要缓存的HTML路径列表
      if (event.url.host === 'www.taobao.com') {
        if (~cacheList.indexOf(event.url.pathname)) return true;
        else return false;
      } else {
        return false;
      }
    },
    workbox.strategies.networkFirst({
      cacheName: 'tbh:html',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 10
        })
      ]
    })
  );
  
  workbox.routing.registerRoute(
    new RegExp('https://g\.alicdn\.com/'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'tbh:static',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20
        })
      ]
    })
  );
  
  workbox.routing.registerRoute(
    new RegExp('https://img\.alicdn\.com/'),
    workbox.strategies.cacheFirst({
      cacheName: 'tbh:img',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 12 * 60 * 60
        })
      ]
    })
  );
  
  workbox.routing.registerRoute(
    new RegExp('https://gtms01\.alicdn\.com/'),
    workbox.strategies.cacheFirst({
      cacheName: 'tbh:img',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 30,
          maxAgeSeconds: 12 * 60 * 60
        })
      ]
    })
  );
  