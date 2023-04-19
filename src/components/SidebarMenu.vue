<template>
  <PrimeToast />

  <PanelMenu
    :model="itemsMain[0].items"
    v-if="itemsMain.length > 0"
    class="sidebar_menu"
    id="main_menu"
  >
    <template #item="{ item }">
      <router-link
        v-if="item.to"
        :to="item.to"
        :class="{ 'p-disabled': item.disabled }"
      >
        <div class="flex flex-row py-2 px-3 gap-2 items-center">
          <span class="flex p-menuitem-icon content-center" v-if="item.icon">
            <i :class="item.icon"></i>
          </span>

          <span class="pt-1 w-full">{{ item.label }}</span>

          <span class="grow"></span>
          <span v-if="item.items" class="flex content-center">
            <i class="pi pi-fw pi-angle-down"></i>
          </span>
        </div>
      </router-link>
      <a
        v-else
        :href="item.url"
        :class="{ 'p-disabled': item.disabled }"
        target="_blank"
      >
        <div class="flex flex-row py-2 px-3 gap-2 items-center">
          <span class="flex p-menuitem-icon content-center" v-if="item.icon">
            <i :class="item.icon"></i>
          </span>

          <span class="pt-1 w-full">{{ item.label }}</span>

          <span class="grow"></span>
          <span v-if="item.items" class="flex content-center">
            <i class="pi pi-fw pi-angle-down"></i>
          </span>
        </div>
      </a>
    </template>
  </PanelMenu>
  <div class="mt-5 text-left w-full" v-if="itemsAdmin[0]?.items.length > 0">
    <span class="ml-5 text-sm font-semibold">{{ t("Admin Area") }}</span>
    <PanelMenu
      :model="itemsAdmin[0].items"
      class="sidebar_menu"
      id="admin_menu"
    >
      <template #item="{ item }">
        <router-link
          v-if="item.to"
          :to="item.to"
          :class="{ 'p-disabled': item.disabled }"
        >
          <div class="flex flex-row py-2 px-3 gap-2 items-center">
            <span class="flex p-menuitem-icon content-center" v-if="item.icon">
              <i :class="item.icon"></i>
            </span>

            <span class="pt-1 w-full">{{ item.label }}</span>

            <span class="grow"></span>
            <span v-if="item.items" class="flex content-center">
              <i class="pi pi-fw pi-angle-down"></i>
            </span>
          </div>
        </router-link>
        <a
          v-else
          :href="item.url"
          :class="{ 'p-disabled': item.disabled }"
          target="_blank"
        >
          <div class="flex flex-row py-2 px-3 gap-2 items-center">
            <span class="flex p-menuitem-icon content-center" v-if="item.icon">
              <i :class="item.icon"></i>
            </span>

            <span class="pt-1 w-full">{{ item.label }}</span>

            <span class="grow"></span>
            <span v-if="item.items" class="flex content-center">
              <i class="pi pi-fw pi-angle-down"></i>
            </span>
          </div>
        </a>
      </template>
    </PanelMenu>
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
  margin: 5px;
}

.sidebar_menu.p-panelmenu .p-panelmenu-header .p-panelmenu-header-content {
  border-radius: 5px !important;
  background: none;
  border: none;
}

.sidebar_menu.p-panelmenu .p-menuitem-text {
  padding-top: 4px;
}

.sidebar_menu a {
  text-decoration: none;
  font-weight: 100;
  font-size: 1rem;
  color: rgb(73, 80, 87);
}
</style>
