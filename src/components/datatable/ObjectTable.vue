<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import type { StoreGeneric } from "pinia";
import { storeToRefs } from "pinia";
import PrimeProgressSpinner from "primevue/progressspinner";
import type { PropType } from "vue";
import { ref } from "vue";
import ObjectTableFrame from "./ObjectTableFrame.vue";

const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  defaultColumns: {
    type: Array as PropType<string[]>,
    required: false,
  },
  displayType: {
    type: String as PropType<"table">,
    required: false,
    default: "table",
  },
  emailButton: {
    type: Boolean,
    required: false,
    default: false,
  },
  allowSelection: {
    type: Boolean,
    default: true,
  },
});
const table = ref();
const error = ref<Object | null>(null);
const data = storeToRefs(props.store)[props.name];

// Load data
if (!data.value.listLoaded) {
  props.store.get(props.name).catch((e: any) => {
    error.value = e;
  });
}

// Optional emails schema
const mainStore = useMainStore();
const { emailsCampaigns } = storeToRefs(mainStore);
if (emailsCampaigns.value.schemaLoaded === false) {
  mainStore.getSchema("emailsCampaigns").catch((e: any) => {
    error.value = e;
  });
}

defineExpose({
  table,
});
</script>

<template>
  <div v-if="error !== null">
    <p>There was an error loading the data.<br />{{ error }}</p>
  </div>
  <div v-else-if="!data.schemaLoaded">
    <PrimeProgressSpinner />
  </div>
  <div v-else-if="displayType == 'table'" class="h-full">
    <ObjectTableFrame
      ref="table"
      :store="store"
      :name="name"
      :objects="data.list"
      :schema="data.schema"
      :default-columns="defaultColumns"
      :emailButton="emailButton"
      :emailCampaignSchema="emailsCampaigns.schema"
      :allowSelection="allowSelection"
    >
      <template #action-column><slot name="action-column"></slot></template>
      <template #toolbar-before><slot name="toolbar-before"></slot></template>
      <template #toolbar-after><slot name="toolbar-after"></slot></template>
    </ObjectTableFrame>
  </div>
  <div v-else>
    <p>Invalid display type.</p>
  </div>
</template>
