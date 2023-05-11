<script setup lang="ts">
import { useMenuStore } from "@/stores/menu";
import { onMounted, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import ErrorItem from "../components/ErrorItem.vue";
import LoadingItem from "../components/LoadingItem.vue";
const route = useRoute();

let type = shallowRef(LoadingItem);
const menuStore = useMenuStore();

let Component = LoadingItem;
function loadItem() {
  console.log("loading");
  if (route.params.extension && route.params.componentId) {
    console.log("if", route.params.componentId);

    // Fetch remote endpoint dynamically and put it into window
    // @ts-ignore
    window.RemoteURLs = {
      a: `http://localhost:${route.params.extension}/assets/disposerv.js`,
    };

    // Import component that gets endpoint from window
    //@ts-ignore
    Component = import("a/component");
  } else {
    Component = ErrorItem;
  }
}
onMounted(() => {
  loadItem();
});
watch(
  () => menuStore.mainMenu.loaded,
  () => {
    type.value = LoadingItem;
    loadItem();
  }
);
// getUrlFromMenuItemId(route.params.menuItemId.toString());

watch(
  () => route.params.extension,
  () => {
    type.value = LoadingItem;
    loadItem();
  }
);
watch(
  () => route.params.component,
  () => {
    type.value = LoadingItem;
    loadItem();
  }
);
</script>

<template>
  <div id="root">
    <component :is="Component"></component>
  </div>
  <div class="extension-wrapper">
    <!-- <component :is="type" v-if="!isIframe"></component> -->
    <!-- <IframeItem v-if="isIframe" :src="iframeSrc" /> -->
  </div>
</template>

<style scoped>
.extension-wrapper {
  width: 100%;
  height: 100%;
}
</style>
