<template>
  <PrimeToast />
  <PrimePanelMenu
    :model="items[0].items"
    v-if="items.length > 0"
    id="main_menu"
  >
    <template #item="{ item }">
      <router-link
        v-if="item.to"
        :to="item.to"
        :class="{ 'p-disabled': item.disabled }"
      >
        <div class="flex flex-row py-1 px-2 gap-2 items-center">
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
        class=""
        :class="{ 'p-disabled': item.disabled }"
        target="_blank"
      >
        <div class="flex flex-row py-1 px-2 gap-2 items-center">
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
  </PrimePanelMenu>
</template>

<script lang="ts" setup>
import { useMenuStore } from "@/stores/menu";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import PrimePanelMenu from "primevue/panelmenu";
import PrimeToast from "primevue/toast";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const menuStore = useMenuStore();
const userStore = useUserStore();
const { menu } = storeToRefs(menuStore);
const items = ref<any[]>([]);

function buildItem(data: any): any {
  if (data !== null) {
    const item: any = {
      label: t(data.label),
      icon: "pi pi-fw " + (data.icon_name ? data.icon_name : ""), // pi pi-fw pi-plus
    };
    console.log(item.icon);
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
      item.url = data.link_source;
    }
    // return item
    return item;
  }
}

function buildMenu(menu: any) {
  items.value = [
    {
      label: t("Main Menu"),
      items: [],
    },
  ];
  if (menu !== null && menu !== null && menu.menu) {
    for (let i = 0; i < menu.menu.length; i++) {
      const item = buildItem(menu.menu[i]);
      if (menu.menu[i].sub_items && menu.menu[i].sub_items.length > 0) {
        item.items = [];
        for (let j = 0; j < menu.menu[i].sub_items.length; j++) {
          const sub_item = buildItem(menu.menu[i].sub_items[j]);
          item.items.push(sub_item);
        }
      }
      items.value[0].items.push(item);
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
.p-panelmenu a {
  color: #000;
  font-size: 15px;
  height: 20px;
  text-decoration: none !important;
}
.p-panelmenu {
  border-radius: 0px;
}
.p-panelmenu .p-menuitem-link {
  padding: 0 !important;
  align-items: center;
  justify-content: center;
}
.p-panelmenu .p-menuitem-text {
  font-size: 15px;
  line-height: normal !important;
}
.p-panelmenu
  .p-panelmenu-panel
  .p-panelmenu-header
  .p-panelmenu-header-content {
  padding-top: 4px;
  padding-bottom: 4px;
}
.p-panelmenu .p-panelmenu-header .p-panelmenu-header-content {
  border-radius: 0px !important;
}
</style>
