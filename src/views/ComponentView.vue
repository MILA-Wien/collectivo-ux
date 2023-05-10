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
  if (route.params.extension && route.params.componentId) {
    switch (route.params.componentId) {
      case "1":
        //@ts-ignore
        Component = import("a/component"); // <-- this has to be defined prior to building.
        break;
      case "2":
        //@ts-ignore
        Component = import("b/component"); // <-- this has to be defined prior to building.
        break;
      case "3":
        //@ts-ignore
        Component = import("c/component"); // <-- this has to be defined prior to building.
        break;
      case "4":
        //@ts-ignore
        Component = import("d/component"); // <-- this has to be defined prior to building.
        break;
      case "5":
        //@ts-ignore
        Component = import("e/component"); // <-- this has to be defined prior to building.
        break;
      case "6":
        //@ts-ignore
        Component = import("f/component"); // <-- this has to be defined prior to building.
        break;
      case "7":
        //@ts-ignore
        Component = import("g/component"); // <-- this has to be defined prior to building.
        break;
      case "8":
        //@ts-ignore
        Component = import("h/component"); // <-- this has to be defined prior to building.
        break;
      default:
        Component = ErrorItem;
        break;
    }
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
