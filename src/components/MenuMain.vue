<template>
  <div>
    <ToastPrime />
    <PrimeMenu :model="items" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useMenuStore } from "@/stores/menu";
import type { MenuItem } from "primevue/menuitem";
import { storeToRefs } from "pinia";
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const store = useMenuStore();
store.getMenu(); //Promise
const items = ref<MenuItem>([]);

const { menu } = storeToRefs(store);
watch(menu, (currentValue, oldValue) => {
  console.log("current", currentValue);
  console.log("old", oldValue);
  items.value = [
    {
      label: "Extensions",
      items: [],
    },
  ];
  if (menu != null && menu.value != null) {
    console.log("menu", menu.value);
    const localMenu = JSON.parse(JSON.stringify(menu.value));
    for (let i = 0; i < localMenu.length; i++) {
      const item = localMenu[i];
      items.value[0].items?.push({
        label: t(item.label),
        icon: "pi pi-fw pi-plus",
        to: "/extension/" + item.extension + "/" + item.microfrontend,
      });
    }
  }
});
</script>
<style scoped></style>
