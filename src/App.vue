<script setup lang="ts">
import { storeToRefs } from "pinia";
import { RouterView } from "vue-router";
import { useUserStore } from "./stores/user";
import HeaderView from "./views/HeaderView.vue";
import MenuView from "./views/SidebarView.vue";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<template>
  <div
    id="collectivo-frame"
    class="flex h-screen bg-mila font-sans"
    v-if="user?.authenticated"
  >
    <MenuView />
    <div id="collectivo-main" class="flex-1 flex flex-col overflow-hidden">
      <HeaderView />
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <div class="mx-auto px-8 py-6 h-full">
          <RouterView />
        </div>
      </main>
    </div>
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
