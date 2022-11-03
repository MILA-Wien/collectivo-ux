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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/micro",
      name: "micro",
      // route level code-splitting
      // this generates a separate chunk (micro.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/MicroView.vue"),
    },
    {
      path: "/iframe",
      name: "iframe",
      // route level code-splitting
      // this generates a separate chunk (micro.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/IFrameView.vue"),
    },
    {
      path: "/extension/:extension/:item",
      name: "extension",
      component: () => import("../views/ExtensionView.vue"),
    },
  ],
});

export default router;
