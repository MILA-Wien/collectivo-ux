import { createRouter, createWebHistory } from "vue-router";
import Default from "@/layouts/DefaultLayout.vue";
import FullScreenLayout from "@/layouts/FullScreen.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      meta: {
        layout: Default,
      },
      component: () => import("../views/DashboardView.vue"),
    },
    {
      path: "/dashboard/dashboard",
      redirect: "/", // redirect to dashboard
    },
    {
      path: "/core/users",
      name: "coreUsers",
      meta: {
        layout: Default,
        isMembersAdmin: true,
      },
      component: () => import("../components/core/CoreUsers.vue"),
    },
    {
      path: "/core/profile",
      name: "coreProfile",
      meta: {
        layout: Default,
        isMembersAdmin: true,
      },
      component: () => import("../components/core/CoreProfileLoader.vue"),
    },
    {
      path: "/core/settings",
      name: "coreSettings",
      meta: {
        layout: Default,
        isMembersAdmin: true,
      },
      component: () => import("../components/NotImplemented.vue"),
    },
    {
      path: "/dashboard/admin",
      name: "dashboardAdmin",
      meta: {
        layout: Default,
        isMembersAdmin: true,
      },
      component: () => import("../components/dashboard/DashboardAdmin.vue"),
    },
    {
      path: "/memberships/admin",
      name: "membershipsAdmin",
      meta: {
        layout: Default,
        isMembersAdmin: true,
      },
      component: () => import("../components/memberships/MembershipsAdmin.vue"),
    },
    {
      path: "/memberships/profile",
      name: "memberships",
      meta: {
        layout: Default,
        requiresAuth: true,
        isMember: true,
      },
      component: () =>
        import("../components/memberships/MembershipsProfile.vue"),
    },
    {
      path: "/mila/registration",
      name: "registration",
      meta: {
        layout: Default,
        requiresAuth: true,
      },
      component: () => import("../components/mila/MilaRegistration.vue"),
    },
    {
      path: "/emails/admin",
      name: "emailsAdmin",
      meta: {
        layout: Default,
        isMembersAdmin: true,
      },
      component: () => import("../components/emails/EmailsAdmin.vue"),
    },
    {
      path: "/tags/admin",
      name: "tagsAdmin",
      meta: {
        layout: Default,
        isMembersAdmin: true,
      },
      component: () => import("../components/tags/TagsAdmin.vue"),
    },
    {
      path: "/payments/admin",
      name: "paymentsAdmin",
      meta: {
        layout: Default,
        isMembersAdmin: true,
      },
      component: () => import("../components/payments/PaymentsAdmin.vue"),
    },
    {
      path: "/extensions/admin",
      name: "extensionsAdmin",
      meta: {
        layout: Default,
        isMembersAdmin: true,
      },
      component: () => import("../components/extensions/ExtensionsAdmin.vue"),
    },
    {
      path: "/iframe/:menuItemId(\\d+)",
      name: "iframe",
      meta: {
        layout: FullScreenLayout,
        isMember: true,
      },
      component: () => import("@/views/IframeView.vue"),
    },
    {
      path: "/component/:extension/:componentId/:componentRoute*",
      name: "component",
      meta: {
        layout: FullScreenLayout,
        isMember: true,
      },
      component: () => import("@/views/ComponentView.vue"),
    },
    // {
    //   path: "/:extension/:id",
    //   name: "notImplemented",
    //   meta: {
    //     isMembersAdmin: false,
    //   },
    //   component: () => import("../components/NotImplemented.vue"),
    // },
  ],
});

export default router;
