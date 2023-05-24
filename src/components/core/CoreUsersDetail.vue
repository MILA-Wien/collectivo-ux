<script setup lang="ts">
import type { endpoints } from "@/api/api";
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
import ObjectMasonry from "@/components/datatable/ObjectMasonry.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import { ref } from "vue";

const menuStore = useMenuStore();
const membersStore = useMembersStore();
menuStore.setTitle("User");
const loaded = ref(false);
const profile_endpoints: Array<keyof typeof endpoints> = [
  "coreUsers",
  "profilesProfiles",
  "paymentsProfiles",

  "membershipsProfiles",
];

async function getProfileEndpoints() {
  // Import additional profile endpoints from extensions
  const settings: any = await import("../../collectivo.json");
  const extension_imports = [];
  for (const extension of settings.extensions) {
    const extensionModule = import(
      `../../extensions/${extension}/extension.json`
    );
    extension_imports.push(extensionModule);
  }
  const extensions_promise = await Promise.allSettled(extension_imports);
  for (const extension of extensions_promise) {
    if (
      extension.status === "fulfilled" &&
      extension.value.profile_endpoints !== undefined
    ) {
      for (const key of extension.value.profile_endpoints) {
        profile_endpoints.push(key);
      }
    }
  }
  loaded.value = true;
}

getProfileEndpoints();
</script>

<template>
  <ObjectMasonry :items="profile_endpoints" v-if="loaded">
    <template #item="{ item }">
      <ObjectDetail :store="membersStore" :name="item" :id="$route.params.id">
      </ObjectDetail>
    </template>
  </ObjectMasonry>
</template>
