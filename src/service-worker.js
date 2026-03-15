const CACHE_VERSION = 'v3.2.0';
const CACHE_NAME = `personality-test-${CACHE_VERSION}`;

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    '/components/BaseComponent.js',
    '/components/TestCard.js',
    '/pages/HomePage.js',
    '/services/StorageService.js',
    '/utils/helpers.js',
    '/favicon.svg',
    '/manifest.json'
];

const EXTERNAL_ASSETS = [
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Outfit:wght@400;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
];

const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

function getCacheStrategy(url) {
    if (url.includes('/api/') || url.includes('googleapis')) {
        return CACHE_STRATEGIES.NETWORK_FIRST;
    }
    if (url.includes('cdn.') || url.includes('cdnjs.')) {
        return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
    }
    return CACHE_STRATEGIES.CACHE_FIRST;
}

self.addEventListener('install', (event) => {
    console.log('[SW] 安装中...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] 缓存静态资源');
                const staticPromise = cache.addAll(STATIC_ASSETS);
                const externalPromise = Promise.all(
                    EXTERNAL_ASSETS.map(url =>
                        fetch(url, { mode: 'cors' })
                            .then(response => {
                                if (response.ok) {
                                    cache.put(url, response);
                                }
                            })
                            .catch(err => console.warn(`[SW] 外部资源缓存失败: ${url}`, err))
                    )
                );
                return Promise.all([staticPromise, externalPromise]);
            })
            .then(() => {
                console.log('[SW] 安装完成');
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] 激活中...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => {
                            console.log(`[SW] 删除旧缓存: ${name}`);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[SW] 激活完成');
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') {
        return;
    }

    if (url.protocol === 'chrome-extension:') {
        return;
    }

    const strategy = getCacheStrategy(request.url);

    switch (strategy) {
        case CACHE_STRATEGIES.NETWORK_FIRST:
            event.respondWith(networkFirst(request));
            break;
        case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
            event.respondWith(staleWhileRevalidate(request));
            break;
        default:
            event.respondWith(cacheFirst(request));
    }
});

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('[SW] 网络请求失败:', error);
        return caches.match('/') || new Response('离线状态', { status: 503 });
    }
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] 网络不可用，使用缓存');
        const cachedResponse = await caches.match(request);
        return cachedResponse || caches.match('/');
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => cachedResponse);

    return cachedResponse || fetchPromise;
}

self.addEventListener('sync', (event) => {
    console.log('[SW] 后台同步:', event.tag);
    if (event.tag === 'sync-test-results') {
        event.waitUntil(syncTestResults());
    }
});

function syncTestResults() {
    console.log('[SW] 同步测试结果');
    // TODO: 实现测试结果同步逻辑
    return Promise.resolve();
}

self.addEventListener('push', (event) => {
    console.log('[SW] 收到推送通知');
    const data = event.data ? event.data.json() : {};

    const options = {
        body: data.body || '您有一条新消息',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
            timestamp: Date.now()
        },
        actions: [
            { action: 'open', title: '查看' },
            { action: 'close', title: '关闭' }
        ],
        tag: data.tag || 'default',
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification(data.title || '人格星球探索', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[SW] 通知点击:', event.action);
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(windowClients => {
                for (const client of windowClients) {
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                return clients.openWindow(url);
            })
    );
});

self.addEventListener('message', (event) => {
    console.log('[SW] 收到消息:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_VERSION });
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(names => {
                return Promise.all(names.map(name => caches.delete(name)));
            }).then(() => {
                event.ports[0].postMessage({ success: true });
            })
        );
    }
});

self.addEventListener('error', (event) => {
    console.error('[SW] 错误:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[SW] 未处理的Promise拒绝:', event.reason);
});
