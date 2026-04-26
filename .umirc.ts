import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/plans", component: "plans" },
    { path: "/plans/:week", component: "weekly" },
    { path: "/user", component: "user" },
  ],
  npmClient: "npm",
  utoopack: {},
});
