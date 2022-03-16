import { skipWaiting, clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { NetworkOnly, NetworkFirst, CacheFirst, StaleWhileRevalidate, Strategy } from "workbox-strategies";
import { registerRoute, setDefaultHandler, setCatchHandler } from "workbox-routing";
import { matchPrecache, precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

skipWaiting();
clientsClaim();

// must include following lines when using inject manifest module from workbox
// https://developers.google.com/web/tools/workbox/guides/precache-files/workbox-build#add_an_injection_point
const WB_MANIFEST = self.__WB_MANIFEST;

// disable workbox logs during development mode
self.__WB_DISABLE_DEV_LOGS = false;

// Precache fallback route and image
WB_MANIFEST.push({
  url: "/fallback",
  revision: "1234567390",
});
precacheAndRoute(WB_MANIFEST);

cleanupOutdatedCaches();

// const UploadAudioSavedPlugin = {
//   cacheWillUpdate: async ({request, response, event, state}) => {
//     console.log("cacheWillUpdate");
//     // Return `response`, a different `Response` object, or `null`.
//     return response;
//   },
//   cacheDidUpdate: async ({cacheName, request, oldResponse, newResponse, event, state}) => {
//     console.log("cacheDidUpdate");
//     // No return expected
//     // Note: `newResponse.bodyUsed` is `true` when this is called,
//     // meaning the body has already been read. If you need access to
//     // the body of the fresh response, use a technique like:
//     // const freshResponse = await caches.match(request, {cacheName});
//   },
//   cacheKeyWillBeUsed: async ({request, mode, params, event, state}) => {
//     console.log("cacheKeyWillBeUsed");
//     // `request` is the `Request` object that would otherwise be used as the cache key.
//     // `mode` is either 'read' or 'write'.
//     // Return either a string, or a `Request` whose `url` property will be used as the cache key.
//     // Returning the original `request` will make this a no-op.
//     return request;
//   },
//   cachedResponseWillBeUsed: async ({cacheName, request, matchOptions, cachedResponse, event, state}) => {
//     console.log("cachedResponseWillBeUsed");
//     // Return `cachedResponse`, a different `Response` object, or null.
//     return cachedResponse;
//   },
//   requestWillFetch: async ({request, event, state}) => {
//     console.log("requestWillFetch");
//     // Return `request` or a different `Request` object.
//     return request;
//   },
//   fetchDidFail: async ({originalRequest, request, error, event, state}) => {
//     console.log("fetchDidFail");
//     // No return expected.
//     // NOTE: `originalRequest` is the browser's request, `request` is the
//     // request after being passed through plugins with
//     // `requestWillFetch` callbacks, and `error` is the exception that caused
//     // the underlying `fetch()` to fail.
//   },
//   fetchDidSucceed: async ({request, response, event, state}) => {
//     console.log("fetchDidSucceed");

//     // Return `response` to use the network response as-is,
//     // or alternatively create and return a new `Response` object.
//     return response;
//   },
//   handlerWillStart: async ({request, event, state}) => {
//     console.log("handlerWillStart");
//     // No return expected.
//     // Can set initial handler state here.
//   },
//   handlerWillRespond: async ({request, response, event, state}) => {
//     console.log("handlerWillRespond");
//     // Return `response` or a different `Response` object.
//     return response;
//   },
//   handlerDidRespond: async ({request, response, event, state}) => {
//     console.log("handlerDidRespond");
//     // No return expected.
//     // Can record final response details here.
//   },
//   handlerDidComplete: async ({request, response, error, event, state}) => {
//     console.log("handlerDidComplete");
//     // No return expected.
//     // Can report any data here.
//   },
//   handlerDidError: async ({request, event, error, state}) => {
//     console.log("handlerDidError");
//     // Return `response`, a different `Response` object as a fallback, or `null`.
//     return response;
//   }
// };

registerRoute(
  "/",
  new NetworkFirst({
    cacheName: "start-url",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET",
);
registerRoute(
  /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
  new CacheFirst({
    cacheName: "google-fonts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 4,
        maxAgeSeconds: 31536e3,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET",
);
registerRoute(
  /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
  new StaleWhileRevalidate({
    cacheName: "static-font-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 4,
        maxAgeSeconds: 604800,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET",
);
// disable image cache, so we could observe the placeholder image when offline
registerRoute(
  /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
  new NetworkOnly({
    cacheName: "static-image-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 64,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET",
);
registerRoute(
  /\.(?:js)$/i,
  new StaleWhileRevalidate({
    cacheName: "static-js-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET",
);
registerRoute(
  /\.(?:css|less)$/i,
  new StaleWhileRevalidate({
    cacheName: "static-style-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET",
);
registerRoute(
  /\.(?:json|xml|csv)$/i,
  new NetworkFirst({
    cacheName: "static-data-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET",
);
registerRoute(
  /\/api\/.*$/i,
  new NetworkFirst({
    cacheName: "apis",
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 16,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET",
);

// class NewStrategy extends Strategy {
//   _handle(request, handler) {
//     // Define handling logic here
//     console.log("aqui gente ???!!");
//     return handler.fetch(request);
//   }
// }

// registerRoute(
//   "https://jsonplaceholder.typicode.com/posts",
//   new NewStrategy({
//     plugins: [
//       UploadAudioSavedPlugin
//     ]
//   }),
//   "GET",
// );

registerRoute(
  /.*/i,
  new NetworkFirst({
    cacheName: "others",
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET",
);

// following lines gives you control of the offline fallback strategies
// https://developers.google.com/web/tools/workbox/guides/advanced-recipes#comprehensive_fallbacks

// Use a stale-while-revalidate strategy for all other requests.
setDefaultHandler(new StaleWhileRevalidate());

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
setCatchHandler(({ event }) => {
  // The FALLBACK_URL entries must be added to the cache ahead of time, either
  // via runtime or precaching. If they are precached, then call
  // `matchPrecache(FALLBACK_URL)` (from the `workbox-precaching` package)
  // to get the response from the correct cache.
  //
  // Use event, request, and url to figure out how to respond.
  // One approach would be to use request.destination, see
  // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c

  if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") return;
  switch (event.request.destination) {
    case "document":
      // If using precached URLs:
      return matchPrecache("/fallback");
      // return caches.match('/fallback')
      break;
    case "image":
      // If using precached URLs:
      return matchPrecache("/images/fallback.png");
      // return caches.match('/static/images/fallback.png')
      break;
    case "font":
    // If using precached URLs:
    // return matchPrecache(FALLBACK_FONT_URL);
    //return caches.match('/static/fonts/fallback.otf')
    //break
    default:
      // If we don't have a fallback, just return an error response.
      return Response.error();
  }
});
