import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/register",
      name: "register",
      meta: {
        requiresAuth: false,
      },
      component: () => import("../views/HomeView.vue"),
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
  ],
});

export default router;
