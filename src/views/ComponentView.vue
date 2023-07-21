<script setup lang="ts">
// Remote entry components are still an experimental feature
import { useMainStore } from "@/stores/main";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { defineAsyncComponent, onMounted, ref, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import IframeItem from "../components/IFrameItem.vue";
import LoadingItem from "../components/LoadingItem.vue";
const route = useRoute();

let type = shallowRef(LoadingItem);
const mainStore = useMainStore();
const settingsStore = useSettingsStore();
const error = ref<Object | null>(null);
const data = storeToRefs(mainStore)["componentsComponents"];
const iframe = ref("");
const remoteID = ref("");
const componentId = ref("");
const components = {
  A: LoadingItem,
  B: LoadingItem,
  C: LoadingItem,
  D: LoadingItem,
  E: LoadingItem,
  F: LoadingItem,
  G: LoadingItem,
  H: LoadingItem,
};

function loadItem() {
  iframe.value = "";
  mainStore
    .get("componentsComponents")
    .catch((e: any) => {
      error.value = e;
    })
    .then(() => {
      // Get component from URL parameters
      const component = data.value.list.find(
        (c: any) =>
          c.extension.name === route.params.extension &&
          c.name === route.params.component
      );
      // Set component ID
      componentId.value = component?.name;
      if (component && component.type === "remote") {
        // Get remote ID for component
        // @ts-ignore
        remoteID.value = settingsStore.getRemoteID(component);
        // Import component via remote ID
        //@ts-ignore
        switch (remoteID.value) {
          case "a":
            //@ts-ignore
            components.A = defineAsyncComponent(() => import("a/component"));
            break;
          case "b":
            //@ts-ignore
            components.B = defineAsyncComponent(() => import("b/component"));
            break;
          case "c":
            //@ts-ignore
            components.C = defineAsyncComponent(() => import("c/component"));
            break;
          case "d":
            //@ts-ignore
            components.D = defineAsyncComponent(() => import("d/component"));
            break;
          case "e":
            //@ts-ignore
            components.E = defineAsyncComponent(() => import("e/component"));
            break;
          case "f":
            //@ts-ignore
            components.F = defineAsyncComponent(() => import("f/component"));
            break;
          case "g":
            //@ts-ignore
            components.G = defineAsyncComponent(() => import("g/component"));
            break;
          case "h":
            //@ts-ignore
            components.H = defineAsyncComponent(() => import("h/component"));
            break;
          default:
            break;
        }
      } else if (component && component.type === "iframe") {
        iframe.value = component.path;
      } else {
        error.value = "Component not found";
      }
    });
}
onMounted(() => {
  loadItem();
});
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
  <div class="v-full h-full" v-if="error">
    An error has occured: {{ error }}
  </div>
  <div class="v-full h-full" v-else-if="iframe != ''">
    <IframeItem :src="iframe" />
  </div>
  <div class="v-full h-full" id="remote_a" v-else-if="remoteID == 'a'">
    <div :id="componentId"></div>
    <component :is="components.A"></component>
  </div>
  <div class="v-full h-full" id="remote_b" v-else-if="remoteID == 'b'">
    <div :id="componentId"></div>
    <component :is="components.B"></component>
  </div>
  <div class="v-full h-full" id="remote_c" v-else-if="remoteID == 'c'">
    <div :id="componentId"></div>
    <component :is="components.C"></component>
  </div>
  <div class="v-full h-full" id="remote_d" v-else-if="remoteID == 'd'">
    <div :id="componentId"></div>
    <component :is="components.D"></component>
  </div>
  <div class="v-full h-full" id="remote_e" v-else-if="remoteID == 'e'">
    <div :id="componentId"></div>
    <component :is="components.E"></component>
  </div>
  <div class="v-full h-full" id="remote_f" v-else-if="remoteID == 'f'">
    <div :id="componentId"></div>
    <component :is="components.F"></component>
  </div>
  <div class="v-full h-full" id="remote_g" v-else-if="remoteID == 'g'">
    <div :id="componentId"></div>
    <component :is="components.G"></component>
  </div>
  <div class="v-full h-full" id="remote_h" v-else-if="remoteID == 'h'">
    <div :id="componentId"></div>
    <component :is="components.H"></component>
  </div>
  <div v-else>An error has occured: remoteID {{ remoteID }} not found</div>
</template>
