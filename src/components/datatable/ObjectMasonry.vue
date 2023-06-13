<script setup lang="ts">
import MasonryWall from "@yeger/vue-masonry-wall";
import type { PropType } from "vue";
defineProps({
  items: {
    type: Array as PropType<any[]>,
    required: true,
  },
});
</script>

<template>
  <MasonryWall :items="items" :ssr-columns="1" :column-width="300" :gap="16">
    <template #default="{ item, index }">
      <slot name="item" v-bind="{ item }"></slot>
    </template>
  </MasonryWall>
</template>
