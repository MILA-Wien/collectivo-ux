<script setup lang="ts">
defineProps<{
  src: string;
}>();
</script>

<template>
  <div class="iframe-component">
    <iframe :src="src" frameborder="0" width="100%"></iframe>
  </div>
</template>

<style scoped>
.iframe-component {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

iframe {
  width: 100%;
  height: 80vh;
  border: 0;
}
</style>
