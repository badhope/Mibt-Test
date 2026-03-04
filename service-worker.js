// 缓存名称
const CACHE_NAME = 'personality-test-v1';

// 需要缓存的资源
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/js/main.js',
    '/js/core.js',
    '/js/data.js',
    '/js/storage.js',
    '/favicon.svg',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Outfit:wght@400;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
];

// 安装Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: 缓存打开');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// 激活Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: 清除旧缓存', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 如果缓存中有响应，则返回缓存
                if (response) {
                    return response;
                }
                
                // 否则进行网络请求
                return fetch(event.request)
                    .then((networkResponse) => {
                        // 检查响应是否有效
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // 克隆响应以便缓存
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return networkResponse;
                    })
                    .catch(() => {
                        // 如果网络请求失败，返回离线页面
                        if (event.request.mode === 'navigate') {
                            return caches.match('/');
                        }
                    });
            })
    );
});

// 后台同步
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-test-results') {
        event.waitUntil(syncTestResults());
    }
});

// 同步测试结果
async function syncTestResults() {
    // 这里可以实现将测试结果同步到服务器的逻辑
    console.log('Service Worker: 同步测试结果');
}

// 推送通知
self.addEventListener('push', (event) => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        data: {
            url: data.url
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});