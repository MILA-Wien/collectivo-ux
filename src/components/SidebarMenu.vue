<template>
  <PrimeToast />

  <PrimePanelMenu
    :model="itemsMain[0].items"
    v-if="itemsMain.length > 0"
    class="sidebar_menu"
    id="main_menu"
  >
    <template #item="{ item }">
      <SidebarMenuItem :item="item" />
    </template>
  </PrimePanelMenu>
  <div class="mt-5 text-left w-full" v-if="itemsAdmin[0]?.items.length > 0">
    <span class="ml-5 text-sm font-semibold">{{ t(adminMenu.label) }}</span>
    <PrimePanelMenu
      :model="itemsAdmin[0].items"
      class="sidebar_menu"
      id="admin_menu"
    >
      <template #item="{ item }">
        <SidebarMenuItem :item="item" />
      </template>
    </PrimePanelMenu>
  </div>
</template>

<script lang="ts" setup>
import { useMenuStore } from "@/stores/menu";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import PrimePanelMenu from "primevue/panelmenu";
import PrimeToast from "primevue/toast";
import SidebarMenuItem from "./SidebarMenuItem.vue";
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
    // set data for iframes
    else if (data.target === "iframe") {
      item.url = data.link;
      item.to = `/iframe/${data.id}`;
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

  &.p-panelmenu {
    .p-panelmenu-panel {
      margin: 5px;
    }

    .p-panelmenu-header .p-panelmenu-header-content {
      border-radius: 5px !important;
      background: none;
      border: none;
    }

    .p-menuitem-text {
      padding-top: 4px;
    }
  }

  a {
    text-decoration: none;
    font-weight: 100;
    font-size: 1rem;
    color: rgb(73, 80, 87);
  }
}
</style>
