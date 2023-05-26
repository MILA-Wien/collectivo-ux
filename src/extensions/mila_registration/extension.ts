import router from "@/router";
export default function () {
  router.addRoute({
    path: "/mila/registration",
    name: "registration",
    meta: {
      requiresAuth: true,
    },
    component: () => import("./components/MilaRegistration.vue"),
  });
}
