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
import ObjectModal from "./ObjectModal.vue";
const { t } = useI18n();

function tt(key: any) {
  try {
    return t(key);
  } catch {
    return key;
  }
}

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
          class="pb-3 flex flex-row w-full"
        >
          <div class="w-48 font-semibold flex-none break-words pr-2">
            {{ tt(field.label) }}
          </div>
          <div class="flex-auto break-words overflow-hidden">
            <div v-if="data.detailLoaded" class="w-full">
              <div v-if="field.input_type == 'multiselect'">
                <div
                  v-for="(value, i) in data.detail[name]"
                  :key="i"
                  class="bg-gray-200 text-gray-700 px-1.5 pt-1.5 pb-0.5 mb-1.5 whitespace-pre-wrap"
                >
                  {{ tt(field.choices![value]) }}
                </div>
              </div>
              <!-- Booleans -->
              <div v-else-if="field.input_type == 'checkbox'">
                <i
                  v-if="data.detail[name] == true"
                  class="pi pi-check bg-green-200 p-1 rounded"
                ></i>
                <i v-else class="pi pi-times bg-red-200 p-1 rounded"></i>
              </div>
              <!-- Strings (generic) -->
              <div
                v-else-if="typeof data.detail[name] == 'string'"
                class="data break-words"
              >
                {{ tt(data.detail[name]) }}
              </div>

              <div v-else-if="data.detail[name]" class="data break-words">
                {{ data.detail[name] }}
              </div>

              <!-- No content -->
              <div v-else-if="field.write_only" class="data">********</div>

              <div v-else class="inline-block w-20 h-6 data"></div>
            </div>
            <div v-else class="text-gray-400 inline-block w-20">
              <PrimeSkeleton class="inline-block"></PrimeSkeleton>
            </div>
          </div>
        </div>
      </div>
    </PrimePanel>
  </div>
  <div v-else-if="error == null">
    <PrimeSkeleton height="3rem"></PrimeSkeleton>
  </div>

  <ObjectModal
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
