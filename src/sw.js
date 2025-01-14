self.addEventListener("fetch", function (event) {
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    (async function () {
      const cache = await caches.open("cache");
      const cachedResponse = await cache.match(event.request);

      try {
        const networkResponse = await fetch(event.request);
        
        const cachedSize = cachedResponse?.headers.get("Content-Length");
        const networkSize = networkResponse.headers.get("Content-Length");

        if (cachedSize !== networkSize) {
          await cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        if (cachedResponse) {
          return cachedResponse;
        }

        return new Response("Network error and no cached data available.", {
          status: 503,
          statusText: "Service Unavailable",
        });
      }
    })()
  );
});
