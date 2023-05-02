<script setup lang="ts">
import { useMenuStore } from "@/stores/menu";
import { shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import ErrorItem from "../components/ErrorItem.vue";
import IframeItem from "../components/IFrameItem.vue";
import LoadingItem from "../components/LoadingItem.vue";
const route = useRoute();

let type = shallowRef(LoadingItem);
const menuStore = useMenuStore();
let iframeSrc = shallowRef("");
let isIframe = shallowRef(false);

function getUrlFromMenuItemId(menuItemId: string) {
  if (menuStore.mainMenu.loaded) {
    const item = menuStore.getMenuItemById(menuItemId);
    if (item?.label) {
      menuStore.setTitle(item?.label);
    }
    if (item !== null && item && item.link) {
      isIframe.value = true;
      iframeSrc.value = item.link;
    } else {
      type.value = ErrorItem;
    }
  }
}
watch(
  () => menuStore.mainMenu.loaded,
  () => {
    type.value = LoadingItem;
    getUrlFromMenuItemId(route.params.menuItemId.toString());
  }
);
getUrlFromMenuItemId(route.params.menuItemId.toString());

watch(
  () => route.params.extension,
  () => {
    type.value = LoadingItem;
    getUrlFromMenuItemId(route.params.menuItemId.toString());
  }
);
watch(
  () => route.params.component,
  () => {
    type.value = LoadingItem;
    console.log(route.params.menuItemId);
    getUrlFromMenuItemId(route.params.menuItemId.toString());
  }
);
</script>

<template>
  <div class="extension-wrapper">
    <component :is="type" v-if="!isIframe"></component>
    <IframeItem v-if="isIframe" :src="iframeSrc" />
  </div>
</template>

<style scoped>
.extension-wrapper {
  width: 100%;
  height: 100%;
}
</style>
