<script setup lang="ts">
import type { endpoints } from "@/api/api";
import type { StoreGeneric } from "pinia";
import { storeToRefs } from "pinia";
import PrimeDataView from "primevue/dataview";
import type { PropType } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String as PropType<keyof typeof endpoints>,
    required: true,
  },
});

// Load data
const error = ref<Object | null>(null);
const data = storeToRefs(props.store)[props.name];
if (!data.value.loaded) {
  props.store.get(props.name).catch((e: any) => {
    error.value = e;
  });
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="grow overflow-auto">
      <!-- Table will fill out full remaining height -->
      <PrimeDataView dataKey="id" :value="data.data">
        <template #list="slotProps">
          <slot name="item" v-bind="slotProps"></slot>
        </template>
      </PrimeDataView>
    </div>
  </div>
</template>

<style scoped>
.p-dataview::v-deep .p-dataview-content {
  background: transparent;
}
</style>
