self.addEventListener("fetch", function (event) {
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    (async function () {
      const cache = await caches.open("cache");
      const cachedResponse = await cache.match(event.request);

      try {
        const networkResponse = await fetch(event.request);

        // Check if the sizes are different by comparing Content-Length headers.
        const cachedSize = cachedResponse?.headers.get("Content-Length");
        const networkSize = networkResponse.headers.get("Content-Length");

        if (cachedSize !== networkSize) {
          // Update the cache if the sizes are different.
          await cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        // Fall back to the cache if the network fails.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Optionally return a fallback response if no cache is available.
        return new Response("Network error and no cached data available.", {
          status: 503,
          statusText: "Service Unavailable",
        });
      }
    })()
  );
});
