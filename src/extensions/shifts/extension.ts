import router from "@/router";
export default function () {
  router.addRoute({
    name: "shiftsAdmin",
    path: "/shifts/admin",
    component: () => import("@/extensions/shifts/components/AdminShifts.vue"),
  });
  router.addRoute({
    name: "shiftsUser",
    path: "/shifts/shifts_user",
    component: () => import("@/extensions/shifts/components/UserShifts.vue"),
  });
  // router.replace(router.currentRoute.value.fullPath)
  setTimeout(() => {
    router.replace(router.currentRoute.value.fullPath);
  }, 1000);
  // router.replace(router.currentRoute.value.fullPath)
}
