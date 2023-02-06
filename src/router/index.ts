import { useUserStore } from "@/stores/user";
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
      path: "/members/registration",
      name: "registration",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../components/members/MembersRegistration.vue"),
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
      path: "/members/members",
      name: "members",
      meta: {
        isMembersAdmin: true,
      },
      component: () => import("../components/members/MembersAdmin.vue"),
    },
    {
      path: "/members/emails",
      name: "emails",
      meta: {
        isMembersAdmin: true,
      },
      component: () => import("../components/members/MembersEmails.vue"),
    },
    {
      path: "/members/tags",
      name: "tags",
      meta: {
        isMembersAdmin: true,
      },
      component: () => import("../components/members/MembersTags.vue"),
    },
    {
      path: "/members/profile",
      name: "profile",
      meta: {
        requiresAuth: true,
        isMember: true,
      },
      component: () => import("../components/members/MembersProfileLoader.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.isMember) {
    // check if user is a member
    // if not, redirect to Dashboard
    // else, continue
    useUserStore().user?.tokenParsed?.realm_access.roles.includes(
      "members_user"
    )
      ? next()
      : next("/");
  }
  if (to.meta.isMembersAdmin) {
    useUserStore().user?.tokenParsed?.realm_access.roles.includes(
      "members_admin"
    )
      ? next()
      : next("/");
  }

  return next();
});

export default router;
