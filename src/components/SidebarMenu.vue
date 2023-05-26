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
import { storeToRefs } from "pinia";
import PrimePanelMenu from "primevue/panelmenu";
import PrimeToast from "primevue/toast";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import SidebarMenuItem from "./SidebarMenuItem.vue";
const { t } = useI18n();
const menuStore = useMenuStore();
const { mainMenu, adminMenu } = storeToRefs(menuStore);

const itemsMain = ref<any[]>([]);
const itemsAdmin = ref<any[]>([]);

function buildMenu(menu: any, items: any) {
  items.value = [
    {
      items: [],
    },
  ];
  if (menu !== null && menu !== null && menu.menu) {
    for (let i = 0; i < menu.menu.length; i++) {
      const item = menu.menu[i];
      if (menu.menu[i].items && menu.menu[i].items.length > 0) {
        item.items = [];
        for (let j = 0; j < menu.menu[i].items.length; j++) {
          const sub_item = menu.menu[i].items[j];
          item.items.push(sub_item);
        }
      }
      if (item.items.length == 0) {
        item.items = undefined;
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
