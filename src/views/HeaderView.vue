<template>
  <header class="flex items-center justify-between px-6 pt-7 lg:pt-10">
    <div class="flex items-bottom">
      <div class="lg:hidden mr-5">
        <PrimeButton
          @click="toggleSideBar()"
          icon="pi pi-align-left"
          class="p-button-outline"
          id="toggle-sidebar-button"
        />
      </div>
      <h1>{{ t(title) }}</h1>
    </div>
  </header>
</template>

<script setup lang="ts">
import PrimeButton from "primevue/button";
import { useMenuStore } from "@/stores/menu";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

const { t } = useI18n();
const menuStore = useMenuStore();
const { getSideBarOpen, title } = storeToRefs(menuStore);
function toggleSideBar() {
  menuStore.setSideBarOpen(getSideBarOpen.value ? false : true);
}
</script>
