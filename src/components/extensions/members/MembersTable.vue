<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";
import MemberDetail from "./MemberDetail.vue";
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { boolean } from "mathjs";
const { t } = useI18n();

const emit = defineEmits(["open:member", "update:member", "delete:member"]);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  members: {
    type: Object,
    required: true,
  },
});
let selectedMember = ref({});
const selectedMembers = ref();
const editMember = ref(false);
function edit(event: any) {
  selectedMember.value = event;
  editMember.value = true;
}

const filters1 = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  first_name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
});
</script>

<template>
  <div class="members-table">
    <DataTable
      :value="members.results"
      :paginator="true"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      dataKey="id"
      v-model:selection="selectedMembers"
      responsiveLayout="scroll"
      :globalFilterFields="['id', 'first_name']"
      filterDisplay="menu"
      v-model:filters="filters1"
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
    >
      <!-- <template #header>
          <div class="flex justify-content-between">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined" @click="clearFilter1()"/>
              <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters1['global'].value" placeholder="Keyword Search" />
              </span>
          </div>
      </template>
      <template #empty>
          No customers found.
      </template> -->
      <Column selectionMode="multiple"></Column>
      <Column field="id" :header="t('ID')" :sortable="true"></Column>
      <Column field="first_name" filterMatchMode="contains" :header="t('Vorname')" :sortable="true">
        <template #filter="{filterModel}">
          hello
          <!-- TODO This is rendered but nothing is visible -->
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
        </template>
      </Column>
      <Column field="last_name" :header="t('Nachname')" :sortable="true"></Column>
      <Column field="person_type" :header="t('Typ')" :sortable="true"></Column>
      <Column field="membership_type" :header="t('Status')" :sortable="true"></Column>
      <Column :header="t('actions')">
        <template #body="slotProps">
          <ButtonPrime
            icon="pi pi-pencil"
            class="p-button-rounded"
            @click="edit(slotProps.data)"
          />
        </template>
      </Column>
      <!-- <template #paginatorstart>
        <ButtonPrime type="button" icon="pi pi-refresh" class="p-button-text" />
      </template> -->
    </DataTable>
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
