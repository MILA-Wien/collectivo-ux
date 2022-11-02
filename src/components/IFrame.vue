<script setup lang="ts">
import { useMenuStore } from "@/stores/menu";
import { useMicroFrontendStore } from "@/stores/microfrontend";
import { useRoute } from "vue-router";

const store = useMenuStore();
store.getMenu(); //Promise
const route = useRoute();

const microfrontendStore = useMicroFrontendStore();
if (typeof route.params.item == "string") {
  microfrontendStore.getMicroFrontend(route.params.item);
}

defineProps<{
  src: string;
}>();
</script>

<template>
  <div class="greetings">
    <iframe :src="src" frameborder="0"></iframe>
  </div>
</template>

<style scoped></style>
