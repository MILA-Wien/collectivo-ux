<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useMainStore } from "../stores/main";
import HeaderView from "../views/HeaderView.vue";
import MenuView from "../views/SidebarView.vue";

const mainStore = useMainStore();
const route = useRoute();

// Load core profile data (including permissions)
mainStore.getDetail("coreProfile").catch((error: any) => {
  console.log(error);
});
</script>

<template>
  <div id="collectivo-frame" class="flex h-screen bg-mila font-sans">
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
