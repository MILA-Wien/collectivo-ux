<script setup lang="ts">
import PrimeProgressSpinner from "primevue/progressspinner";
import type { PropType } from "vue";

defineProps({
  error: {
    type: Object as PropType<Object | null>,
  },
});
</script>

<template>
  <div v-if="error == null">
    <PrimeProgressSpinner />
  </div>
  <div v-else>
    <p>There was an error loading the data: {{ error }}</p>
  </div>
</template>
