<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";
import MemberDetail from "./MemberDetail.vue";
import InputText from "primevue/inputtext";
import MultiSelect from 'primevue/multiselect';
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import { FilterMatchMode } from "primevue/api";
import JsonCSV from "vue-json-csv";
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
const columns: any[] = []
for (const [key, value] of Object.entries(props.schema)) {
  console.log(value)
  columns.push(
    {
      field: key,
      header: t(value.label),
      sortable: true,
      filter: true,
      filterMatchMode: FilterMatchMode.CONTAINS,}
  );
}

// Selected columns
const selectedColumns = ref<any[]>([]);
const startingColumns = [
  'id', 'first_name', 'last_name', 'email', 'person_type']
for (const col of startingColumns) {
  selectedColumns.value.push(columns.find(c => c.field === col));
}

const filters1 = ref({
  id: { value: null, matchMode: FilterMatchMode.EQUALS },
  first_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  last_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  person_type: { value: null, matchMode: FilterMatchMode.EQUALS },
  membership_type: { value: null, matchMode: FilterMatchMode.EQUALS },
});
</script>

<template>
  <div class="members-table">
    <Toolbar class="mb-4">
      <template #start>
        <div style="text-align:left">
          <MultiSelect v-model="selectedColumns" :options="columns"
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
      sortField="id"
      :sortOrder="1"
      responsiveLayout="scroll"
      :resizableColumns="true"
      columnResizeMode="fit"
      showGridlines
    >

      <!-- Selection column -->
      <Column selectionMode="multiple"></Column>

      <!-- Content columns -->
      <Column v-for="col of selectedColumns"
          :field="col.field" :header="col.header"
          :sortable="col.sortable" :filter="col.filter">
        <template #filter="{ filterModel }">
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
