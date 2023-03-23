<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
import { ref } from "vue";
const store = useSettingsStore();
const error = ref<Object | null>(null);
store.getVersion().catch((e: any) => {
  error.value = e;
});
</script>

<template>
  <span v-if="error !== null" class="text-red-600 font-bold">
    no connection
  </span>
  <span v-else-if="store.version" id="version-string">
    v{{ store.version.version }}
  </span>
  <span v-else>loading ...</span>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}
</style>
