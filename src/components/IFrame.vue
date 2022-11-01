<script setup lang="ts">
import { useMicroFrontendStore, useMenuStore } from "@/stores/menu";

const store = useMenuStore();
store.getMenu(); //Promise

const store = useMicroFrontendStore();
store.getMicroFrontend(); //Promise

defineProps<{
  src: string;
}>();
</script>

<template>
  <div class="greetings">
    <iframe :src="src" frameborder="0"></iframe>
  </div>
</template>

<style scoped>
</style>