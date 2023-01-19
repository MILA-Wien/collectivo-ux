<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";
import ObjectDetail from "./ObjectDetail.vue";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";

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
      <template #start> </template>
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
      class="p-datatable-sm"
    >
      <Column
        v-for="(value, col) in objects[0]"
        :header="col"
        :key="col"
        :field="col"
      >
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

<style scoped></style>
