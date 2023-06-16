<!-- A panel that displays the data of an object and an edit button. -->
<script setup lang="ts">
import type { DataSchema } from "@/api/types";
import { checkCondition } from "@/helpers/schema";
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
props.store.getDetail(props.name, props.id, true).catch((e: any) => {
  error.value = e;
});

// Editor state
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
        <div
          v-if="
            String(name) != 'id' &&
            String(name) != 'user' &&
            checkCondition(data.detail, field.visible)
          "
          class="pb-3"
        >
          {{ t(field.label) }}:

          <span v-if="data.detailLoaded">
            <span v-if="field.input_type == 'multiselect'">
              <span
                v-for="(value, i) in data.detail[name] as Array<any>"
                :key="i"
                class="bg-slate-200 my-1 mr-1 pt-1 rounded inline-block px-1"
              >
                {{ field.choices![value] }}
              </span>
            </span>
            <!-- Booleans -->
            <span v-else-if="field.input_type == 'checkbox'">
              <i
                v-if="data.detail[name] == true"
                class="pi pi-check bg-green-200 p-1 rounded"
              ></i>
              <i v-else class="pi pi-times bg-red-200 p-1 rounded"></i>
            </span>
            <!-- All other cases with content -->
            <span v-else-if="data.detail[name]" class="data">
              {{ data.detail[name] }}
            </span>
            <!-- No content -->
            <span v-else class="inline-block w-20 h-6 data"></span>
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

<style lang="scss" scoped>
.data {
  @apply bg-slate-200 mr-1 pt-1 px-1 h-6 rounded whitespace-pre-wrap leading-7;
}
</style>
