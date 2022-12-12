<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";
import MemberDetail from "./MemberDetail.vue";
import InputText from 'primevue/inputtext';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
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
const dt = ref();
let selectedMember = ref({});
const selectedMembers = ref();
const editMember = ref(false);
function edit(event: any) {
  selectedMember.value = event;
  editMember.value = true;
}

const filters1 = ref({
  id: { value: null, matchMode: FilterMatchMode.EQUALS },
  first_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  last_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  person_type: { value: null, matchMode: FilterMatchMode.EQUALS },
  membership_type: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const exportCSV = () => {
  // TODO This exports ALL members but should only export selectedMembers
  dt.value.exportCSV();
};
</script>

<template>

  <div class="members-table">

    <Toolbar class="mb-4">
      <template #start>
      </template>

      <template #end>
          <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
      </template>
    </Toolbar>

    <DataTable
      :value="members.results"
      :paginator="true"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      dataKey="id"
      ref="dt"
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
      <Column selectionMode="multiple"></Column>
      <Column field="id" :header="t('ID')" :sortable="true" :showFilterMatchModes="false">
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
      <Column field="first_name" :header="t('Vorname')" :sortable="true" :showFilterMatchModes="false">
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
      <Column field="last_name" :header="t('Nachname')" :sortable="true" :showFilterMatchModes="false">
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>

      <Column field="email" :header="t('Email')" :sortable="true" :showFilterMatchModes="false">
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
      <Column field="person_type" :header="t('Typ')" :sortable="true" :showFilterMatchModes="false">
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
      <Column field="membership_type" :header="t('Status')" :sortable="true" :showFilterMatchModes="false">
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
      <Column field="tags" :header="t('Tags')" :sortable="true" :showFilterMatchModes="false">
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
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
