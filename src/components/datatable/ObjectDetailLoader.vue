<script setup lang="ts">
import type { endpoints } from "@/api/api";
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
import type { StoreGeneric } from "pinia";
import { storeToRefs } from "pinia";
import type { PropType } from "vue";
import { ref } from "vue";

const emit = defineEmits(["close"]);

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
    validator: (prop) => typeof prop === "number" || prop === null,
    required: false,
  },
  create: {
    type: Boolean,
    required: true,
  },
});

const error = ref<Object | null>(null);
const data = storeToRefs(props.store)[props.name];

// Load data
if (!props.create) {
  data.value.loaded = false;
  props.store.get(props.name, props.id).catch((e: any) => {
    error.value = e;
  });
} else {
  props.store.getSchema(props.name).catch((e: any) => {
    error.value = e;
  });
}

console.log(data.value);
</script>

<template>
  <ObjectDetail
    v-if="data.loaded || data.schemaLoaded"
    :object="data.data"
    :create="create"
    :store="store"
    :name="name"
    :schema="data.schema"
    @close="emit('close')"
  />
</template>
