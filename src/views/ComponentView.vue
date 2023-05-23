<script setup lang="ts">
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { onMounted, ref, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import LoadingItem from "../components/LoadingItem.vue";

const route = useRoute();

let type = shallowRef(LoadingItem);
const menuStore = useMenuStore();
const membersStore = useMembersStore();
const settingsStore = useSettingsStore();

// Load data
const error = ref<Object | null>(null);
const data = storeToRefs(membersStore)["componentsComponents"];
const componentLoaded = ref(false);
let Component = LoadingItem;

function loadItem() {
  membersStore
    .get("componentsComponents")
    .catch((e: any) => {
      error.value = e;
    })
    .then(() => {
      // Get component from URL parameters
      const component = data.value.list.find(
        (c: any) =>
          c.extension.name === route.params.extension && // needs ID
          c.name === route.params.component
      );
      console.log("component", component);
      if (component) {
        // Get remote ID for component
        // @ts-ignore
        const remoteID = settingsStore.getRemoteID(component);
        console.log("remoteID", remoteID);
        // @ts-ignore
        console.log("remoteURL", window.RemoteURLs.a);
        // Import component via remote ID
        //@ts-ignore
        Component = import(`a/component2`);
        // Component = import(`${remoteID}/${component.name}`);
        componentLoaded.value = true;
      } else {
        console.log("Component not found");
        error.value = "Component not found";
      }
    });
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
  <!-- <div v-if="error">
    <ErrorItem :error="error" />
  </div>
  <div v-else-if="componentLoaded" id="root">
    <component :is="Component"></component>
  </div>
  <div v-else>
    <LoadingItem />
  </div> -->
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
