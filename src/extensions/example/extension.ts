import router from "@/router";
export default function () {
  router.addRoute({
    name: "exampleAdmin",
    path: "/example/admin",
    component: () => import("@/extensions/example/components/AdminExample.vue"),
  });
  console.log("Example extension loaded.");
}
