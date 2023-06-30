<script setup lang="ts">
import { storeToRefs } from "pinia";
import PrimeConfirmDialog from "primevue/confirmdialog";
import PrimeToast from "primevue/toast";
import { useUserStore } from "./stores/user";
import LayoutView from "./views/LayoutView.vue";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<template>
  <PrimeToast />
  <PrimeConfirmDialog></PrimeConfirmDialog>
  <LayoutView v-if="user?.authenticated" />
</template>

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
