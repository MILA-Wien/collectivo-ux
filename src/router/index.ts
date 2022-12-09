import { createRouter, createWebHistory } from "vue-router";

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
      path: "/membership/registration",
      name: "registration",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../components/extensions/membership/RegistrationForm.vue"),
    },
    {
      path: "/:extension/:component",
      name: "extension",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/ExtensionView.vue"),
    },
    {
      path: "/members/profile",
      name: "profile",
      component: () => import("../components/extensions/membership/MembershipProfile.vue"),
    },
  ],
});

export default router;

