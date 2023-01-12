<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";
import InputText from "primevue/inputtext";
import ObjectDetail from "./ObjectDetail.vue";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";

import { FilterMatchMode } from "primevue/api";
import JsonCSV from "vue-json-csv";
const { t } = useI18n();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// console.log(props.data)
const datatable = ref();
const selectedObjects = ref();

const editActive = ref(false);
const editObject = ref({});
function edit(event: any) {
  editObject.value = event;
  editActive.value = true;
}

// const filters1 = ref({
//   id: { value: null, matchMode: FilterMatchMode.EQUALS },
//   first_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
//   last_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
//   email: { value: null, matchMode: FilterMatchMode.CONTAINS },
//   person_type: { value: null, matchMode: FilterMatchMode.EQUALS },
//   membership_type: { value: null, matchMode: FilterMatchMode.EQUALS },
// });
</script>

<template>
  <div class="datatable">
    <Toolbar class="mb-4">
      <template #start> </template>
      <template #end>
        <Button label="Create" />
        <Button label="Delete" :disabled="!selectedObjects" />
      </template>
    </Toolbar>

    <DataTable
      :value="data"
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
      class="p-datatable-sm"
    >

      <Column v-for="(value, col) in data[0]" :header="col" :key="col" :field="col">
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
      @close="editActive = false"
    />

  </div>
</template>

<style scoped>
</style>
