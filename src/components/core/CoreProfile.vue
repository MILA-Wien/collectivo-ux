<script setup lang="ts">
import type { endpoints } from "@/api/api";
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
import ObjectMasonry from "@/components/datatable/ObjectMasonry.vue";
import { extensions } from "@/helpers/settings";
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
const menuStore = useMenuStore();
const mainStore = useMainStore();
menuStore.setTitle("My data");

// Core profile endpoints
const profile_endpoints: Array<keyof typeof endpoints> = [
  "profilesProfilesSelf",
];

// Import additional profile endpoints from extensions
for (const extension of extensions) {
  if (extension.profile_admin_endpoints !== undefined) {
    for (const key of extension.profile_admin_endpoints) {
      profile_endpoints.push(key);
    }
  }
}
</script>

<template>
  <ObjectMasonry :items="profile_endpoints">
    <template #item="{ item }">
      <ObjectDetail :store="mainStore" :name="item"> </ObjectDetail>
    </template>
  </ObjectMasonry>
</template>
