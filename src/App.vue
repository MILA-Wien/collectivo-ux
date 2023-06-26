<script setup lang="ts">
import { storeToRefs } from "pinia";
import PrimeConfirmDialog from "primevue/confirmdialog";
import PrimeToast from "primevue/toast";
import { RouterView, useRoute } from "vue-router";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import { useMainStore } from "./stores/main";
import { useUserStore } from "./stores/user";
import HeaderView from "./views/HeaderView.vue";
import MenuView from "./views/SidebarView.vue";

const userStore = useUserStore();
const mainStore = useMainStore();
const { user } = storeToRefs(userStore);
const route = useRoute();

mainStore.getDetail("coreProfile").catch((error) => {
  console.log(error);
});
</script>

<template>
  <PrimeToast />
  <PrimeConfirmDialog></PrimeConfirmDialog>
  <div
    id="collectivo-frame"
    class="flex h-screen bg-mila font-sans"
    v-if="user?.authenticated"
  >
    <MenuView />
    <component :is="route.meta.layout || DefaultLayout">
      <template #header>
        <HeaderView />
      </template>
      <template #main>
        <RouterView />
      </template>
    </component>
  </div>
</template>

<style scoped>
#collectivo-frame {
  background-color: #f7f6edce;
}
</style>

<style lang="scss">
html {
  font-size: 14px;
}

body {
  margin: 0;
  padding: 0;
}

/* Global styles for primevue components */
[type="checkbox"],
[type="radio"] {
  border: 1px solid #676d73;
}
.p-checkbox.p-component {
  display: flex;
}

/* TODO: Tabview full height as a component */
.tabview-full-height {
  .p-tabview {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .p-tabview-nav-container {
    box-shadow: 0 0px 1px -1px rgba(0, 0, 0, 0.2),
      0 0px 1px 0 rgba(0, 0, 0, 0.14), 0 0px 3px 0 rgba(0, 0, 0, 0.12);
  }

  .p-tabview-panels,
  .p-tabview-panel {
    height: 100%;
    overflow: auto;
    background: none !important;
    padding: 10px 0px 0px 0px !important;
  }
}
</style>
