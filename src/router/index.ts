import { createRouter, createWebHistory } from "vue-router";
import VersionView from "../views/VersionView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/DashboardView.vue"),
    },
    {
      path: "/dashboard/dashboard",
      redirect: "/", // redirect to dashboard
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
      path: "/:extension/:component",
      name: "extension",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/ExtensionView.vue"),
    },
  ],
});

export default router;
