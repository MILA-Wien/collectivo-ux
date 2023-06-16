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
  <div class="mb-10">
    <MasonryWall :items="items" :ssr-columns="1" :column-width="300" :gap="16">
      <template #default="{ item }">
        <slot name="item" v-bind="{ item }"></slot>
      </template>
    </MasonryWall>
  </div>
</template>
