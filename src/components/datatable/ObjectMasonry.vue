<script setup lang="ts">
import { VueFlexWaterfall } from "vue-flex-waterfall";
import type { PropType } from "vue";

defineProps({
  items: {
    type: Array as PropType<any[]>,
    required: true,
  },
});
</script>

<template>
  <VueFlexWaterfall
    align-content="stretch"
    class="w-full"
    col="3"
    col-spacing="10px"
    :break-at="{ 1536: 2, 768: 1 }"
  >
    <div v-for="(item, i) in items" :key="i" class="waterfall-item mb-5">
      <slot name="item" v-bind="{ item }"></slot>
    </div>
  </VueFlexWaterfall>
</template>

<style scoped lang="scss">
.waterfall-item {
  width: 100%;
  @media screen and (min-width: 768px) {
    width: calc(50% - 9px);
  }
  @media screen and (min-width: 1536px) {
    width: calc(33.333% - 6px);
  }
}
</style>
