import { generateSW } from "workbox-build";

generateSW({
  swDest: "dist/service-worker.js",
  globDirectory: "dist",
  globPatterns: ["**/*.{js,css,html,png,svg,json,ico}"],
  globIgnores: ["service-worker.js", "workbox-*.js"],
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "firestore-cache",
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 },
      },
    },
    {
      urlPattern: /^https:\/\/www\.googleapis\.com\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "googleapis-cache",
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
      },
    },
  ],
}).then(({ count, size }) => {
  console.log(`Service worker generated. Precache: ${count} files (${(size / 1024).toFixed(1)} kB)`);
});
