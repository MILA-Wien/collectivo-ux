<script setup lang="ts">
import { ref } from "vue";
import type { PropType } from "vue";
import { storeToRefs, type Store } from "pinia";
import type { StoreGeneric } from "pinia";
import ObjectTable from "./ObjectTable.vue";
import ProgressSpinner from 'primevue/progressspinner';
import type { endpoints } from "@/api/api";

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

const error = ref<Object|null>(null);
const data = storeToRefs(props.store)[props.name];

// Load data
if (data.value === null) {
  props.store.get(props.name).catch((e: any) => {error.value = e})
}

</script>

<template>
  <div>
    <div v-if="error !== null">
      <p>There was an error loading the data.<br/>{{error}}</p>
    </div>
    <div v-else-if="data === null">
      <ProgressSpinner />
    </div>
    <div v-else>
      <ObjectTable :store="store" :name="name" :objects="data.objects" :schema="data.schema"/>
    </div>
  </div>
</template>

<style scoped>
</style>
