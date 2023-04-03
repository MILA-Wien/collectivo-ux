import router from "@/router";
export default function () {
    router.addRoute({
        name: 'shiftsAdmin', 
        path: '/shifts/admin',
        component: () => import("@/extensions/shifts/components/AdminShifts.vue")
    })
    router.addRoute({
        name: 'shiftsAdmin', 
        path: '/shifts/user',
        component: () => import("@/extensions/shifts/components/UserShifts.vue")
    })
    router.replace(router.currentRoute.value.fullPath)
}