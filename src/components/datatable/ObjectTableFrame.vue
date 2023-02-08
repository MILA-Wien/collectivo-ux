<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import JsonCSV from "vue-json-csv";

import { FilterOperator } from "primevue/api";
import PrimeToolbar from "primevue/toolbar";
import PrimeButton from "primevue/button";
import PrimeMultiSelect from "primevue/multiselect";

import ObjectDetail from "./ObjectDetail.vue";
import ObjectTable from "./ObjectTable.vue";
import { matchModes, getDefaultMatchMode } from "@/helpers/filters";

import type { PropType } from "vue";
import type { StoreGeneric } from "pinia";
import type { endpoints } from "@/api/api";

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
  objects: {
    type: Array,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
});

// Filter functions (match modes) ------------------------------------------ //
const filters = ref<{ [key: string]: any }>({});
function clearFilters() {
  for (const value of Object.values(filters.value)) {
    value.constraints[0].value = null;
  }
}

// Data columns ------------------------------------------------------------ //
const columns: any[] = [];
const selectedColumns = ref<any[]>([]);

var column_index = 0;
for (const [key, value] of Object.entries(props.schema)) {
  columns.push({
    field: key,
    header: t(value.label),
    input_type: value.input_type,
    index: ++column_index,
  });

  // Set default filters
  filters.value[key] = {
    operator: FilterOperator.AND,
    constraints: [
      { value: null, matchMode: getDefaultMatchMode(value.input_type) },
    ],
  };

  // Add choices to column
  if (value.choices == undefined) {
    continue;
  }
  columns[columns.length - 1].choice_list = [];
  columns[columns.length - 1].choices = value.choices;
  var i = 0;
  for (const [key2, value2] of Object.entries(value.choices) as any) {
    columns[columns.length - 1].choice_list.push({
      label: t(value2),
      value: key2,
      key: ++i,
    });
  }
}

// Set default columns
// TODO: Load default columns from schema
const defaultColumns = [
  "sent",
  "name",
  "label",
  "status",
  "template",
  "design",
  "body",
];
for (const col of defaultColumns) {
  if (!columns.find((c) => c.field === col)) {
    continue;
  }
  selectedColumns.value.push(columns.find((c) => c.field === col));
}

// Maintain column order
selectedColumns.value.sort((a, b) => a.index - b.index);
watch(selectedColumns, (val) => {
  val.sort((a, b) => a.index - b.index);
});

// Datatable --------------------------------------------------------------- //
const selectedObjects = ref([]);

// Dialogs ----------------------------------------------------------------- //
const editActive = ref(false);
const editObject = ref({});
const editCreate = ref(false);
function createObjectFn() {
  editObject.value = {};
  editCreate.value = true;
  editActive.value = true;
}
</script>

<template>
  <div class="flex flex-col h-full bg-white">
    <!-- Toolbar -->
    <PrimeToolbar class="mb-4">
      <template #start>
        <div class="m-1 text-left">
          <PrimeButton
            :label="t('Create')"
            @click="createObjectFn()"
            class="p-button-success"
          >
          </PrimeButton>
        </div>
        <div class="m-1 text-left">
          <PrimeMultiSelect
            v-model="selectedColumns"
            :options="columns"
            optionLabel="header"
            :filter="true"
            :placeholder="t('Columns')"
            :maxSelectedLabels="0"
            :selectedItemsLabel="t('Columns')"
            scrollHeight="400px"
            class="w-26"
          />
        </div>
      </template>
      <template #end>
        <div class="m-1">
          <PrimeButton
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            class="p-button-outlined"
            @click="clearFilters()"
          >
          </PrimeButton>
        </div>
        <div class="m-1">
          <PrimeButton
            :label="t('Download')"
            :disabled="!(selectedObjects?.length > 0)"
          >
            <JsonCSV
              v-if="selectedObjects?.length > 0"
              :data="selectedObjects"
              name="export.csv"
            >
              {{ t("Download") }}
            </JsonCSV>
          </PrimeButton>
        </div>
      </template>
    </PrimeToolbar>

    <div class="grow">
      <!-- Table will fill out full remaining height -->
      <ObjectTable
        :store="store"
        :name="name"
        :objects="objects"
        :schema="schema"
        :matchModes="matchModes"
        :selectedColumns="selectedColumns"
        v-model:filters="filters"
        v-model:selectedObjects="selectedObjects"
        v-model:editObject="editObject"
        v-model:editActive="editActive"
        v-model:editCreate="editCreate"
      />
    </div>
  </div>

  <!-- Detail dialog -->
  <ObjectDetail
    v-if="editActive"
    :object="editObject"
    :create="editCreate"
    :store="store"
    :name="name"
    :schema="schema"
    @close="editActive = false"
  />
</template>
