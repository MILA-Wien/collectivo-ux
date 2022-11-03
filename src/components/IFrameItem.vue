<script setup lang="ts">
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
