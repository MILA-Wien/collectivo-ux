<script setup lang="ts">
import { ref, watch } from "vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";
import ObjectDetail from "./ObjectDetail.vue";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import PrimeDropdown from "primevue/dropdown";
import PrimeMultiSelect from "primevue/multiselect";
import PrimeInputText from "primevue/inputtext";
// import PrimeCalendar from "primevue/calendar";
import type { PropType } from "vue";
import type { StoreGeneric } from "pinia";
import type { endpoints } from "@/api/api";
import JsonCSV from "vue-json-csv";
import { FilterService } from "primevue/api";

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

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("de-AT");
}
function formatMultiSelect(data: any) {
  const len = Array.isArray(data) ? data.length : 0;
  const str = len > 1 ? "objects" : "object";
  return `${len} ${t(str)}`;
}

FilterService.register("isNull", (a) => a == undefined);
const matchModes: any = {
  text: [
    { label: "Contains", value: FilterMatchMode.CONTAINS },
    { label: "Contains not", value: FilterMatchMode.NOT_CONTAINS },
    { label: "Starts With", value: FilterMatchMode.STARTS_WITH },
    { label: "Is Empty", value: "isNull" },
  ],
  date: [
    { label: "Equals", value: FilterMatchMode.EQUALS },
    { label: "Before", value: FilterMatchMode.LESS_THAN },
    { label: "After", value: FilterMatchMode.GREATER_THAN },
    { label: "Is Empty", value: "isNull" },
  ],
  multiselect: [
    { label: "Contains", value: FilterMatchMode.CONTAINS },
    { label: "Contains not", value: FilterMatchMode.NOT_CONTAINS },
    { label: "Equals", value: FilterMatchMode.EQUALS },
    { label: "Is Empty", value: "isNull" },
  ],
  select: [
    { label: "Equals", value: FilterMatchMode.EQUALS },
    { label: "Is Empty", value: "isNull" },
  ],
  number: [
    { label: "Equals", value: FilterMatchMode.EQUALS },
    { label: "Less Than", value: FilterMatchMode.LESS_THAN },
    { label: "Greater Than", value: FilterMatchMode.GREATER_THAN },
    { label: "Is Empty", value: "isNull" },
  ],
};

function getDefaultMatchMode(input_type: string) {
  if (matchModes[input_type]) {
    return matchModes[input_type][0].value;
  } else {
    return;
  }
}

// List of columns from schema
const columns: any[] = [];
const filters = ref<{ [key: string]: any }>({});
var column_index = 0;
for (const [key, value] of Object.entries(props.schema)) {
  columns.push({
    field: key,
    header: t(value.label),
    input_type: value.input_type,
    index: ++column_index,
  });

  // Initialize filters with default settings
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
console.log(columns)
function clearFilters() {
  for (const value of Object.values(filters.value)) {
    value.constraints[0].value = null;
  }
}

// Selected columns
const selectedColumns = ref<any[]>([]);
watch(selectedColumns, (val) => {
  // Sort columns by index
  val.sort((a, b) => a.index - b.index);
})

// TODO: Load default columns from schema
const defaultColumns = ["sent", "name", "status", "template", "design"];
for (const col of defaultColumns) {
  if (!columns.find((c) => c.field === col)) {
    continue;
  }
  selectedColumns.value.push(columns.find((c) => c.field === col));
}

const datatable = ref();
const selectedObjects = ref();

const editActive = ref(false);
const editObject = ref({});
const editCreate = ref(false);
function edit(event: any) {
  editObject.value = event;
  editCreate.value = false;
  editActive.value = true;
}
function create() {
  editObject.value = {};
  editCreate.value = true;
  editActive.value = true;
}
</script>

<template>
  <div class="datatable">
    <Toolbar class="mb-4">
      <template #start>
        <div class="m-1 text-left">
          <Button
            :label="t('Create')"
            @click="create()"
            class="p-button-success"
          >
          </Button>
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
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            class="p-button-outlined"
            @click="clearFilters()"
          >
          </Button>
        </div>
        <div class="m-1">
          <Button
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
          </Button>
        </div>
      </template>
    </Toolbar>

    <DataTable
      :value="objects"
      v-model:selection="selectedObjects"
      dataKey="id"
      ref="datatable"
      :paginator="true"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50, 100]"
      :currentPageReportTemplate="
        t('Showing') +
        ' {first} ' +
        t('to') +
        ' {last} ' +
        t('of') +
        ' {totalRecords}'
      "
      responsiveLayout="scroll"
      :resizableColumns="true"
      columnResizeMode="fit"
      showGridlines
      class="p-datatable-sm object-table"
      filterDisplay="menu"
      v-model:filters="filters"
    >
      <!-- Selection column -->
      <Column selectionMode="multiple"></Column>

      <!-- Content columns -->
      <Column
          v-for="col of selectedColumns"
          :header="col.header"
          :key="col.field"
          :field="col.field"
          :sortable="true"
          :filterMatchModeOptions="matchModes[col.input_type]">
        <!-- Custom bodies for different input types -->
        <template
          #body="{ data }"
          v-if="col.input_type == 'date' || col.input_type == 'datetime'"
        >
          {{ formatDateTime(data[col.field]) }}
        </template>
        <template #body="{ data }" v-else-if="col.input_type == 'select'">
          <div v-if="data[col.field]" class="tag">
            {{ col.choices[data[col.field]] }}
          </div>
        </template>
        <template #body="{ data }" v-else-if="col.input_type == 'multiselect'">
          <!-- TODO: Inspect function to show objects -->
          {{ formatMultiSelect(data[col.field]) }}
        </template>

        <!-- Custom filters for different input types -->
        <template #filter="{ filterModel }">
          <div v-if="filterModel.matchMode != 'isNull'">
            <div v-if="col.input_type == 'multiselect'">
              <!-- Multiple choice -->
              <PrimeMultiSelect
                v-model="filterModel.value"
                :options="col.choices"
                optionLabel="label"
                optionValue="value"
                placeholder="Any"
                class="p-column-filter"
              >
                <template #option="slotProps">
                  <div class="p-multiselect-representative-option">
                    <span>{{ slotProps.option.label }}</span>
                  </div>
                </template>
              </PrimeMultiSelect>
            </div>
            <div v-else-if="col.input_type == 'select'">
              <!-- Single choice -->
              <PrimeDropdown
                v-model="filterModel.value"
                :options="col.choice_list"
                optionLabel="label"
                optionValue="value"
                placeholder="Any"
                class="p-column-filter"
                :showClear="true"
              >
                <template #value="slotProps">
                  <span class="tag" v-if="slotProps.value">
                    {{ col.choices[slotProps.value] }}
                  </span>
                  <span v-else>{{ slotProps.placeholder }}</span>
                </template>
                <template #option="slotProps">
                  <span class="tag">
                    {{ t(slotProps.option.label) }}
                  </span>
                </template>
              </PrimeDropdown>
            </div>
            <div v-else-if="col.input_type == 'date'">
              Date filter not implemented yet
              <!-- TODO Filter doesn't work yet -->
              <!-- <PrimeCalendar v-model="filterModel.value" /> -->
            </div>
            <div v-else-if="col.input_type == 'datetime'">
              Datetime filter not implemented yet
              <!-- TODO Filter doesn't work yet -->
              <!-- <PrimeCalendar v-model="filterModel.value" :showTime="true" /> -->
            </div>
            <div v-else>
              <PrimeInputText
                type="text"
                v-model="filterModel.value"
                class="p-column-filter"
                placeholder="Type filter"
              />
            </div>
          </div>
        </template>
      </Column>

      <!-- Edit column -->
      <Column>
        <template #body="slotProps">
          <ButtonPrime
            icon="pi pi-pencil"
            class="p-button-text p-button-sm"
            @click="edit(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <ObjectDetail
      v-if="editActive"
      :object="editObject"
      :create="editCreate"
      :store="store"
      :name="name"
      :schema="schema"
      @close="editActive = false"
    />
  </div>
</template>

<style lang="scss">
.object-table.p-component {
  font-size: 14px;
}

.object-table.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td,
.object-table.p-datatable.p-datatable-sm .p-datatable-tbody > tr > th {
  padding: 5px 10px 5px 10px;
  vertical-align: middle;
  white-space: normal;
}
.tag {
  font-size: 13px;
  padding-top: 3px;
  padding-bottom: 1px;
  padding-left: 5px;
  padding-right: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: black;
  border-radius: 3px;
  width: fit-content;
}
</style>
