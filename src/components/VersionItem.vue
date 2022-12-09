<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
const store = useSettingsStore();
store.getVersion();
</script>

<template>
  <!-- <div class="s">
    <div class="s__version"> -->
  <span v-if="store.version" id="version-string"> version {{ store.version.version }} </span>
  <span v-else>loading ...</span>
  <!-- </div>
  </div> -->
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}
</style>
