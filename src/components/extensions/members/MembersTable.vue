<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";
import MemberDetail from "./MemberDetail.vue";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import { FilterMatchMode } from "primevue/api";
import JsonCSV from "vue-json-csv";
import Dropdown from 'primevue/dropdown';
const { t } = useI18n();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  members: {
    type: Object,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
});
const datatable = ref();
let selectedMember = ref({});
const selectedMembers = ref();
const editMember = ref(false);
function edit(event: any) {
  selectedMember.value = event;
  editMember.value = true;
}

// List of columns from schema
const columns: any[] = [];
for (const [key, value] of Object.entries(props.schema)) {
  columns.push({
    field: key,
    header: t(value.label),
    sortable: true,
    filter: true,
    filterMatchMode: FilterMatchMode.CONTAINS,
  });

  // Add choices to column
  if (value.choices == undefined) {
    continue;
  }
  columns[columns.length - 1].choices = [];
  for (const [key2, value2] of Object.entries(value.choices) as any) {
    columns[columns.length - 1].choices.push({
      label: t(value2),
      value: key2,
    });
  }
}

// Selected columns
const selectedColumns = ref<any[]>([]);
const startingColumns = [
  "id",
  "first_name",
  "last_name",
  "person_type",
  "membership_type",
  "shares_number",
];
for (const col of startingColumns) {
  selectedColumns.value.push(columns.find((c) => c.field === col));
}

// TODO GENERATE FROM SCHEMA
const filters1 = ref({
  id: { value: null, matchMode: FilterMatchMode.EQUALS },
  first_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  last_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  person_type: { value: null, matchMode: FilterMatchMode.EQUALS },
  membership_type: { value: null, matchMode: FilterMatchMode.EQUALS },
  membership_status: { value: null, matchMode: FilterMatchMode.EQUALS },
});
</script>

<template>
  <div class="members-table">
    <Toolbar class="mb-4">
      <template #start>
        <div style="text-align: left">
          <MultiSelect
            v-model="selectedColumns"
            :options="columns"
            optionLabel="header"
            :filter="true"
            placeholder="Columns"
            :maxSelectedLabels="0"
            selectedItemsLabel="Columns"
            scrollHeight="400px"
            class="w-32"
          />
        </div>
      </template>
      <template #end>
        <Button label="Export" icon="pi pi-upload" :disabled="!selectedMembers">
          <JsonCSV
            v-if="selectedMembers"
            :data="selectedMembers"
            :fields="[
              'id',
              'first_name',
              'last_name',
              'email',
              'person_type',
              'membership_type',
            ]"
            :name="t('members') + '.csv'"
          ></JsonCSV>
          <!-- TODO: EXPORT SELECTED COLUMNS -->
        </Button>
      </template>
    </Toolbar>

    <DataTable
      :value="members.results"
      v-model:selection="selectedMembers"
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
      :globalFilterFields="['id', 'first_name']"
      filterDisplay="menu"
      v-model:filters="filters1"
      sortField="first_name"
      :sortOrder="1"
      responsiveLayout="scroll"
      :resizableColumns="true"
      columnResizeMode="fit"
      showGridlines
    >
      <!-- Selection column -->
      <Column selectionMode="multiple"></Column>

      <!-- Content columns from schema -->
      <Column
        v-for="col of selectedColumns"
        :field="col.field"
        :header="col.header"
        :key="col.field"
        :sortable="col.sortable"
        :filter="col.filter"
      >
        <template #body="{data}" v-if="col.choices != undefined">
          <span class="bg-amber-200 px-1 py-0.5">{{ t(data[col.field]) }}</span>
        </template>

        <!-- Filter for choices -->
        <template #filter="{filterModel}" v-if="col.choices != undefined">
          <Dropdown v-model="filterModel.value" :options="col.choices" placeholder="Any" class="p-column-filter" :showClear="true"
          optionLabel="label" optionValue="value">
          <template #value="slotProps">
            <span class="bg-amber-200 px-1 py-0.5" v-if="slotProps.value">{{t(slotProps.value)}}</span>
            <span v-else>{{slotProps.placeholder}}</span>
          </template>
          <template #option="slotProps">
            <!-- TODO Future option: :class="'customer-badge status-' -->
            <span class="bg-amber-200 px-1 py-0.5">{{t(slotProps.option.label)}}</span>
          </template>
          </Dropdown>
        </template>

        <!-- Filter for other fields -->
        <template #filter="{ filterModel }" v-else>
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
          />
        </template>
      </Column>

      <!-- Action column for member details -->
      <Column :header="t('actions')">
        <template #body="slotProps">
          <ButtonPrime
            icon="pi pi-pencil"
            class="p-button-rounded"
            @click="edit(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Dialogue for member details -->
    <MemberDetail
      v-if="editMember"
      :member="selectedMember"
      @close="editMember = false"
    />
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
</style>
