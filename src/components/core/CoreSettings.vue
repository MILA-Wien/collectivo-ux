<script setup lang="ts">
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
import ObjectMasonry from "@/components/datatable/ObjectMasonry.vue";
import { extensions } from "@/helpers/settings";
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const menuStore = useMenuStore();
const mainStore = useMainStore();
menuStore.setTitle("Settings");

// Core profile endpoints
const settings_endpoints: Array<String> = ["coreSettings"];

// Import additional profile endpoints from extensions
for (const extension of extensions) {
  if (extension.settings_endpoints !== undefined) {
    for (const key of extension.settings_endpoints) {
      settings_endpoints.push(key);
    }
  }
}
</script>

<template>
  <ObjectMasonry :items="settings_endpoints">
    <template #item="{ item }">
      <ObjectDetail :store="mainStore" :name="item"> </ObjectDetail>
    </template>
  </ObjectMasonry>
</template>
