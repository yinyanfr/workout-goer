import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/plans", component: "plans" },
    { path: "/plans/:date", component: "daily" },
  ],
  npmClient: "npm",
  utoopack: {},
});
