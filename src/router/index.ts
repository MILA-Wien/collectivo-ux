import { createRouter, createWebHistory } from "vue-router";
import VersionView from "../views/VersionView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "version",
      component: VersionView,
    },
    {
      path: "/about",
      name: "about",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/micro",
      name: "micro",
      component: () => import("../views/MicroView.vue"),
    },
    {
      path: "/:extension/:component",
      name: "extension",
      component: () => import("../views/ExtensionView.vue"),
    },
  ],
});

export default router;
