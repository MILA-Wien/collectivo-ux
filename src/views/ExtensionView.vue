<script setup lang="ts">
import { useRoute } from "vue-router";
import { shallowRef, watch, ref } from "vue";
import LoadingItem from "../components/LoadingItem.vue";
import ErrorItem from "../components/ErrorItem.vue";
import IframeItem from "../components/IFrameItem.vue";
import { useMenuStore } from "@/stores/menu";
const route = useRoute();

let type = shallowRef(LoadingItem);
const menuStore = useMenuStore();
let iframeSrc = shallowRef("");
let isIframe = shallowRef(false);

function getComponent(extension: string, component: string) {
  const componentName = "../extensions/" + extension + "_" + component;
  if (menuStore.menuLoaded) {
    const item = menuStore.getMenuItem(extension, component);
    if (item?.label) {
      menuStore.setTitle(item?.label);
    }
    if (item !== null && item) {
      if (item.action === "component") {
        isIframe.value = false;
        import(componentName /* @vite-ignore */) // vite-ignore is required for dynamic imports
          .then((module) => {
            type.value = module.default;
          })
          .catch(() => {
            type.value = ErrorItem;
          });
      } else if (item.action === "link" && item.link_source) {
        iframeSrc.value = item.link_source;
        isIframe.value = true;
      }
    } else {
      import(componentName /* @vite-ignore */) // vite-ignore is required for dynamic imports
        .then((module) => {
          type.value = module.default;
        })
        .catch(() => {
          type.value = ErrorItem;
        });
      //import a non menu item
    }
  }
}
watch(
  () => menuStore.menuLoaded,
  () => {
    type.value = LoadingItem;
    getComponent(
      route.params.extension.toString(),
      route.params.component.toString()
    );
  }
);
getComponent(
  route.params.extension.toString(),
  route.params.component.toString()
);

watch(
  () => route.params.extension,
  () => {
    type.value = LoadingItem;
    getComponent(
      route.params.extension.toString(),
      route.params.component.toString()
    );
  }
);
watch(
  () => route.params.component,
  () => {
    type.value = LoadingItem;
    getComponent(
      route.params.extension.toString(),
      route.params.component.toString()
    );
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
