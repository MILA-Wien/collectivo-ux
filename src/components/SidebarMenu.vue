<template>
  <PrimeToast />

  <PanelMenu
    :model="itemsMain[0].items"
    v-if="itemsMain.length > 0"
    class="sidebar_menu"
  >
  </PanelMenu>
  <div class="mt-3 text-left w-full" v-if="itemsAdmin[0]?.items.length > 0">
    <span class="m-3 text-sm font-semibold">{{ t("Admin Area") }}</span>
    <PanelMenu :model="itemsAdmin[0].items" class="sidebar_menu"> </PanelMenu>
  </div>
</template>

<script lang="ts" setup>
import { useMenuStore } from "@/stores/menu";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import PanelMenu from "primevue/panelmenu";
import PrimeToast from "primevue/toast";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const menuStore = useMenuStore();
const userStore = useUserStore();
const { mainMenu, adminMenu } = storeToRefs(menuStore);
// TODO: Replace with prime menuitem type
const itemsMain = ref<any[]>([]);
const itemsAdmin = ref<any[]>([]);

function buildItem(data: any): any {
  if (data !== null) {
    const item: any = {
      label: t(data.label),
      icon: "pi pi-fw " + (data.icon_name ? data.icon_name : ""),
    };

    // set link for logout
    if (data.extension.name === "core" && data.component === "logout") {
      item.url = userStore.user?.logoutUrl || "/";
    }
    // set path for internal links
    else if (data.component) {
      item.to = "/" + data.extension.name + "/" + data.component;
    }
    // set link for external links
    else if (data.link && data.target === "blank") {
      item.url = data.link;
      item.target = data.target;
    }
    // return item
    return item;
  }
}

function buildMenu(menu: any, items: any) {
  items.value = [
    {
      label: t("Main Menu"),
      items: [],
    },
  ];
  if (menu !== null && menu !== null && menu.menu) {
    for (let i = 0; i < menu.menu.length; i++) {
      const item = buildItem(menu.menu[i]);
      if (menu.menu[i].items && menu.menu[i].items.length > 0) {
        item.items = [];
        for (let j = 0; j < menu.menu[i].items.length; j++) {
          const sub_item = buildItem(menu.menu[i].items[j]);
          item.items.push(sub_item);
        }
      }
      items.value[0].items.push(item);
    }
  }
  console.log(items.value);
}

menuStore.getMenus().then(() => {
  if (mainMenu !== null && mainMenu.value !== null && mainMenu.value.menu) {
    buildMenu(mainMenu.value, itemsMain);
    buildMenu(adminMenu.value, itemsAdmin);
  }
}); //Promise
watch(mainMenu, () => {
  if (mainMenu !== null && mainMenu.value !== null && mainMenu.value.menu) {
    buildMenu(mainMenu.value, itemsMain);
    buildMenu(adminMenu.value, itemsAdmin);
  }
});
</script>

<style lang="scss">
.sidebar_menu {
  border: none;
  width: 100%;
}

.sidebar_menu.p-panelmenu .p-panelmenu-panel {
  margin: 10px;
}

.sidebar_menu.p-panelmenu .p-panelmenu-header .p-panelmenu-header-content {
  border-radius: 10px !important;
}

.sidebar_menu.p-panelmenu .p-panelmenu-header .p-panelmenu-header-content a {
  font-weight: 100;
  padding: 0.6rem;
  font-size: 1rem;
  color: rgb(73, 80, 87);
}

.sidebar_menu.p-panelmenu .p-menuitem-text {
  padding-top: 4px;
}
</style>
