<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import JsonCSV from "vue-json-csv";

import { getDefaultMatchMode, matchModes } from "@/helpers/filters";
import { FilterOperator } from "primevue/api";
import PrimeButton from "primevue/button";
import PrimeMultiSelect from "primevue/multiselect";
import PrimeToolbar from "primevue/toolbar";
import ObjectDetailEdit from "./ObjectDetailEdit.vue";
import ObjectTable from "./ObjectTable.vue";

import type { endpoints } from "@/api/api";
import type { StoreGeneric } from "pinia";
import type { PropType } from "vue";

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
  defaultColumns: {
    type: Array as PropType<string[]>,
    required: false,
  },
  emailButton: {
    type: Boolean,
    required: false,
  },
  emailCampaignSchema: {
    type: Object,
    required: true,
  },
});

// Filter functions (match modes) ------------------------------------------ //
const filters = ref<{ [key: string]: any }>({});
//   // Todo: Clear filters
// function clearFilters() {
//   for (const value of Object.values(filters.value)) {
//     value.constraints = [{ value: null, matchMode: undefined }];
//   }
// }

// Data columns ------------------------------------------------------------ //
const columns: any[] = [];
const selectedColumns = ref<any[]>([]);

var column_index = 0;
for (const [key, value] of Object.entries(props.schema)) {
  // Skip ID column
  if (key == "id") {
    continue;
  }

  columns.push({
    field: key,
    header: t(value.label),
    input_type: value.input_type,
    index: ++column_index,
  });

  // Set default filters
  filters.value[key] = {
    // Todo: Add support for OR operator in the backend
    // operator: FilterOperator.AND,
    // Operator needed for clear filter function
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
const defaultColumns = props.defaultColumns
  ? props.defaultColumns
  : ["id", "name", "label", "status"];
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
const table = ref<any>(null);

// Dialogs ----------------------------------------------------------------- //
const editActive = ref(false);
const editObject = ref({});
const editCreate = ref(false);
function createObjectFn() {
  editObject.value = {};
  editCreate.value = true;
  editActive.value = true;
}

// Send emails ------------------------------------------------------------- //
const editEmailsActive = ref(false);
const editEmailsObject = ref({});
const editEmailsCreate = ref(false);
function sendEmails() {
  editEmailsObject.value = {
    // Recipients should be a list of user id's
    // If object has no user, it is assumed that it is the user object itself
    // Set is used to remove duplicates (e.g. the same user is selected twice)
    recipients: Array.from(
      new Set(selectedObjects.value.map((m: any) => (m.user ? m.user : m.id)))
    ),
  };
  editEmailsCreate.value = true;
  editEmailsActive.value = true;
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <PrimeToolbar class="c-datatable-toolbar">
      <template #start>
        <div class="m-1 text-left">
          <!-- v-tooltip.top="t('Create new entry')" -->
          <PrimeButton
            icon="pi pi-plus"
            class="c-icon-button p-button-sm"
            @click="createObjectFn()"
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
        <div class="m-1">
          <PrimeButton
            icon="pi pi-refresh"
            class="c-icon-button p-button-sm"
            @click="table.refresh()"
          >
          </PrimeButton>
        </div>
      </template>
      <template #end>
        <!-- TODO: Fix clear filters button  -->
        <!-- <div class="m-1">
                  <PrimeButton type="button" icon="pi pi-filter-slash" :label="t('Clear')" class="p-button-outlined"
                    @click="clearFilters()">
                  </PrimeButton>
            </div> -->
        <div class="m-1" v-if="emailButton">
          <!--  v-tooltip.top="t('Send emails')" -->
          <PrimeButton
            icon="pi pi-send"
            class="c-icon-button p-button-sm"
            :disabled="!(selectedObjects.length > 0)"
            @click="sendEmails"
          >
          </PrimeButton>
        </div>
        <div class="m-1">
          <!-- v-tooltip.top="t('Export')" -->
          <PrimeButton
            icon="pi pi-file-export"
            class="c-icon-button p-button-sm"
            :disabled="!(selectedObjects?.length > 0)"
          >
            <JsonCSV
              v-if="selectedObjects?.length > 0"
              icon="pi pi-file-export"
              :data="selectedObjects"
              name="export.csv"
            >
              <i class="pi pi-file-export"></i>
            </JsonCSV>
          </PrimeButton>
        </div>
      </template>
    </PrimeToolbar>

    <div class="grow overflow-auto">
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
        ref="table"
      >
        <template #action-column><slot name="action-column"></slot></template>
      </ObjectTable>
    </div>
  </div>

  <!-- Detail dialog -->
  <ObjectDetailEdit
    v-if="editActive"
    :object="editObject"
    :create="editCreate"
    :store="store"
    :name="name"
    :schema="schema"
    @close="editActive = false"
  />

  <!-- Dialogue for email campaign details -->
  <ObjectDetailEdit
    v-if="editEmailsActive"
    :object="editEmailsObject"
    :create="editEmailsCreate"
    :store="props.store"
    :name="'emailsCampaigns'"
    :schema="emailCampaignSchema"
    @close="editEmailsActive = false"
  />
</template>

<style scoped>
.c-datatable-toolbar {
  border-bottom: 0;
  padding: 0.5rem;
  border-radius: 0px;
}
.c-icon-button {
  width: 2.8rem;
  height: 2.8rem;
}
</style>
