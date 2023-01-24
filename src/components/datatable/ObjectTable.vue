<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";
import ObjectDetail from "./ObjectDetail.vue";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import PrimeMultiSelect from "primevue/multiselect";
import type { PropType } from "vue";
import type { StoreGeneric } from "pinia";
import type { endpoints } from "@/api/api";

const { t } = useI18n();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

function formatDate(date: string) {
  return new Date(date).toLocaleString('de-AT');
}

// List of columns from schema
const columns: any[] = [];
const filters = ref<{ [key: string]: any }>({});
for (const [key, value] of Object.entries(props.schema)) {
  columns.push({
    field: key,
    header: t(value.label),
    input_type: value.input_type,
  });

  // // Initialize filters with default settings
  // filters.value[key] = {
  //   operator: FilterOperator.AND,
  //   constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
  // };

  // Add choices to column
  if (value.choices == undefined) {
    continue;
  }
  columns[columns.length - 1].choices = [];

  var i = 0;
  for (const [key2, value2] of Object.entries(value.choices) as any) {
    columns[columns.length - 1].choices.push({
      label: t(value2),
      value: key2,
      key: ++i,
    });
  }
}

// Selected columns
const selectedColumns = ref<any[]>([]);
const defaultColumns = ['id', 'name', 'created'];
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
        <Button
          :label="t('Create')"
          @click="create()"
          class="p-button-success"
        />
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
      sortField="id"
      :sortOrder="1"
      responsiveLayout="scroll"
      :resizableColumns="true"
      columnResizeMode="fit"
      showGridlines
      class="p-datatable-sm object-table"
    >
      <Column
        v-for="col of selectedColumns"
        :header="col.header"
        :key="col.field"
        :field="col.field"
        :sortable="true"
      >

        <!-- Body for choices -->
        <template #body="{ data }" v-if="col.input_type=='datetime'">
          <!-- Handle datetime -->
          {{ formatDate(data[col.field]) }}
        </template>

      </Column>

      <Column>
        <template #body="slotProps">
          <ButtonPrime
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text"
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
</style>
