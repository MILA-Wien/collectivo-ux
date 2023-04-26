<script setup lang="ts">
import type { endpoints } from "@/api/api";
import type { StoreGeneric } from "pinia";
import { storeToRefs } from "pinia";
import PrimePanel from "primevue/panel";
import type { PropType } from "vue";
import { ref } from "vue";
import ObjectDetail from "./ObjectDetail.vue";

const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String as PropType<keyof typeof endpoints>,
    required: true,
  },
  id: {
    validator: (prop) =>
      typeof prop === "number" || typeof prop === "string" || prop === null,
    required: false,
  },
});

// Load data
const error = ref<Object | null>(null);
const data = storeToRefs(props.store)[props.name];
data.value.loaded = false;
props.store.get(props.name, props.id).catch((e: any) => {
  error.value = e;
});
const editActive = ref(false);
</script>

<template>
  <PrimePanel :header="name">
    <template #icons>
      <button
        class="p-panel-header-icon p-link mr-2"
        @click="editActive = true"
      >
        <i class="pi pi-pencil"></i>
      </button>
    </template>
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
    <div v-if="data.loaded || data.schemaLoaded">
      <div v-for="(field, name, i) in data.schema" :key="i">
        <div v-if="String(name) != 'id' && String(name) != 'user'" class="pb-3">
          {{ field.label }}:
          <span class="bg-slate-200 px-1 pt-1 rounded">{{
            data.data[name] ? data.data[name] : "undefined"
          }}</span>
        </div>
      </div>
    </div>
  </PrimePanel>

  <!-- TODO: Remove delete option -->
  <ObjectDetail
    v-if="editActive"
    :object="data.data"
    :create="false"
    :store="store"
    :name="name"
    :schema="data.schema"
    @close="editActive = false"
  />
</template>
