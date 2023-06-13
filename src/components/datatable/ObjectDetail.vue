<script setup lang="ts">
import type { DataSchema } from "@/api/types";
import type { StoreGeneric } from "pinia";
import { storeToRefs } from "pinia";
import PrimePanel from "primevue/panel";
import PrimeSkeleton from "primevue/skeleton";
import type { PropType, Ref } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ObjectEditor from "./ObjectEditor.vue";
const { t } = useI18n();

const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String,
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
const data = storeToRefs(props.store)[props.name] as Ref<DataSchema>;
props.store.get(props.name, props.id, true).catch((e: any) => {
  error.value = e;
});
const editActive = ref(false);
</script>

<template>
  <div v-if="data.schemaLoaded && error == null">
    <PrimePanel :header="t(data.schema.label)">
      <template #icons>
        <button
          class="p-panel-header-icon p-link mr-2"
          @click="editActive = true"
        >
          <span class="pi pi-pencil"></span>
        </button>
      </template>
      <div v-for="(field, name, i) in data.schema.fields" :key="i">
        <div v-if="String(name) != 'id' && String(name) != 'user'" class="pb-3">
          {{ t(field.label) }}:

          <span class="bg-slate-200 px-1 pt-1 rounded" v-if="data.detailLoaded">
            <span v-if="field.input_type == 'multiselect'">
              <span
                v-for="(value, i) in data.detail[name] as Array<any>"
                :key="i"
              >
                {{ field.choices![value] }},
              </span>
            </span>
            <span v-else-if="data.detail[name]">
              {{ data.detail[name] }}
            </span>
            <span v-else class="text-gray-400 inline-block w-20"></span>
          </span>
          <span v-else class="text-gray-400 inline-block w-20">
            <PrimeSkeleton class="inline-block"></PrimeSkeleton>
          </span>
        </div>
      </div>
    </PrimePanel>
  </div>
  <div v-else-if="error == null">
    <PrimeSkeleton height="3rem"></PrimeSkeleton>
  </div>

  <ObjectEditor
    v-if="editActive"
    :object="data.detail"
    :create="false"
    :store="store"
    :name="name"
    :schema="data.schema"
    :allow_delete="false"
    @close="editActive = false"
  />
</template>
