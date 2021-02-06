async function openCache() {
	let cacheName = "Mahjong4Friends"
	let cache = await caches.open(cacheName)
	return cache
}

self.addEventListener("install", function() {
    self.skipWaiting()
})

self.addEventListener("activate", async function() {
	let cache = await openCache();
	cache.add(registration.scope);
})

//Network, with fallback to cache. 
self.addEventListener('fetch', async function(event) {
	let url = event.request.url
	event.respondWith((async() => {
		let cache = await openCache()
		let network;
		try {
			network = await fetch(event.request)
			try {
				cache.put(url, network.clone())
			}
			catch (e) {console.error(e)}
			return network
		}
		catch (e) {
			let fromCache = await cache.match(url)
			if (fromCache) {return fromCache}
		}
	})())
});
