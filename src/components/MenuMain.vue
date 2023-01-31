<template>
  <PrimeToast />
  <PrimeMenu :model="items" v-if="items.length > 0" id="main_menu" />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import type { ExtensionMenu } from "@/api/types";
import { useUserStore } from "@/stores/user";
import PrimeMenu from "primevue/menu";
import PrimeToast from "primevue/toast";

const { t } = useI18n();
const menuStore = useMenuStore();
const userStore = useUserStore();
const { menu } = storeToRefs(menuStore);
const items = ref<any[]>([]);

function buildMenu(menu: ExtensionMenu) {
  items.value = [
    {
      label: t("Main Menu"),
      items: [],
    },
  ];
  if (menu !== null && menu !== null && menu.menu) {
    for (let i = 0; i < menu.menu.length; i++) {
      const item = menu.menu[i];
      if (item !== null) {
        const targetPath = item.component_name
          ? item.component_name
          : item.item_id;
        const icon = item.icon_name ? item.icon_name : ""; // pi pi-fw pi-plus
        type toType = string | null;
        let to: toType = "/" + item.extension + "/" + targetPath;
        let url = null;
        // set link for logout
        if (item.extension === "auth" && item.component_name === "logout") {
          url = userStore.user?.logoutUrl || "/";
          to = null;
        }
        // set link for external links
        if (
          item.action === "link" &&
          item.action_target === "blank" &&
          item.link_source
        ) {
          url = item.link_source;
          to = null;
        }
        // push item to menu
        items.value[0].items?.push({
          label: t(item.label),
          icon,
          to,
          url,
        });
      }
    }
  }
}
menuStore.getMenu().then(() => {
  if (menu !== null && menu.value !== null && menu.value.menu) {
    buildMenu(menu.value);
  }
}); //Promise
watch(menu, () => {
  if (menu !== null && menu.value !== null && menu.value.menu) {
    buildMenu(menu.value);
  }
});
</script>

<style>
/* can't be scoped because we are overwriting prime styles */
#main_menu {
  border: none;
  width: 100%;
}
</style>
