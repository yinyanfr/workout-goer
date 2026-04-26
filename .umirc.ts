import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/plans", component: "plans" },
    { path: "/plans/:week", component: "weekly" },
    { path: "/user", component: "user" },
    { path: "/help", component: "help" },
  ],
  npmClient: "npm",
  utoopack: {},
  metas: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, viewport-fit=cover",
    },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent",
    },
    { name: "theme-color", content: "#141418" },
    { name: "description", content: "Structured workout plans" },
  ],
  links: [
    { rel: "manifest", href: "/manifest.json" },
    {
      rel: "apple-touch-icon",
      href: "/icon-192.png",
    },
  ],
  scripts: [
    {
      content: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/service-worker.js').then(function(r){console.log('SW registered:',r.scope)}).catch(function(e){console.log('SW registration failed:',e)})})}`,
    },
  ],
});
