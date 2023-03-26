import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
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
        isMembersAdmin: true,
      },
      component: () => import("../components/core/CoreUsers.vue"),
    },
    {
      path: "/core/profile",
      name: "coreProfile",
      meta: {
        isMembersAdmin: true,
      },
      component: () => import("../components/core/CoreProfileLoader.vue"),
    },
    {
      path: "/core/settings",
      name: "coreSettings",
      meta: {
        isMembersAdmin: true,
      },
      component: () => import("../components/NotImplemented.vue"),
    },
    {
      path: "/memberships/admin",
      name: "membershipsAdmin",
      meta: {
        isMembersAdmin: true,
      },
      component: () => import("../components/memberships/MembershipsAdmin.vue"),
    },
    {
      path: "/memberships/profile",
      name: "memberships",
      meta: {
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
        requiresAuth: true,
      },
      component: () => import("../components/mila/MilaRegistration.vue"),
    },
    {
      path: "/emails/admin",
      name: "emailsAdmin",
      meta: {
        isMembersAdmin: true,
      },
      component: () => import("../components/emails/EmailsAdmin.vue"),
    },
    {
      path: "/tags/admin",
      name: "tagsAdmin",
      component: () => import("../components/tags/TagsAdmin.vue"),
    },
    {
      path: "/payments/admin",
      name: "paymentsAdmin",
      component: () => import("../components/payments/PaymentsAdmin.vue"),
    },
    {
      path: "/extensions/admin",
      name: "extensionsAdmin",
      meta: {
        isMembersAdmin: true,
      },
      component: () => import("../components/extensions/ExtensionsAdmin.vue"),
    },
    {
      path: "/shifts/admin",
      name: "shiftsAdmin",
      meta: {
        isMembersAdmin: true,
      },
      component: () => import("../components/NotImplemented.vue"),
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   // if (to.meta.isMember) {
//   //   // check if user is a member
//   //   // if not, redirect to Dashboard
//   //   // else, continue
//   //   useUserStore().user?.tokenParsed?.realm_access.roles.includes(
//   //     "members_user"
//   //   )
//   //     ? next()
//   //     : next("/");
//   // }
//   // if (to.meta.isMembersAdmin) {
//   //   useUserStore().user?.tokenParsed?.realm_access.roles.includes(
//   //     "members_admin"
//   //   )
//   //     ? next()
//   //     : next("/");
//   // }

//   return next();
// });

export default router;
