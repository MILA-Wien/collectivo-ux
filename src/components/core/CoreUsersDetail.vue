<script setup lang="ts">
import type { endpoints } from "@/api/api";
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
import ObjectMasonry from "@/components/datatable/ObjectMasonry.vue";
import { extensions } from "@/helpers/settings";
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
const menuStore = useMenuStore();
const mainStore = useMainStore();
menuStore.setTitle("User");

// Core profile endpoints
const profile_endpoints: Array<keyof typeof endpoints> = [
  "coreUsers",
  "profilesProfiles",
  "paymentsProfiles",
  "tagsProfiles",
  "membershipsProfiles",
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
      <ObjectDetail :store="mainStore" :name="item" :id="$route.params.id">
      </ObjectDetail>
    </template>
  </ObjectMasonry>
</template>
