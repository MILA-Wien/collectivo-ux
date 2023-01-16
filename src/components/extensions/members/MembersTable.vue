<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

import MemberDetail from "./MemberDetail.vue";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import JsonCSV from "vue-json-csv";
import Dropdown from 'primevue/dropdown';
import { useToast } from "primevue/usetoast";
import type { Member } from "../../../api/types";
import { useI18n } from "vue-i18n";
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
const toast = useToast();
let selectedMember = ref({});
const selectedMembers = ref<Member[]>([]);
const editMember = ref(false);
function edit(event: any) {
  selectedMember.value = event;
  editMember.value = true;
}

// List of columns from schema
const columns: any[] = [];
const filters = ref<{ [key: string]: any }>({});
for (const [key, value] of Object.entries(props.schema)) {
  columns.push({
    field: key,
    header: t(value.label),
    inputType: value.input_type,
  });

  // Initialize filters with default settings
  filters.value[key] = {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]};

  // Add choices to column
  if (value.choices == undefined) {
    continue;
  }
  columns[columns.length - 1].choices = [];

  // TODO: Change from i to index
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
const startingColumns = [
  "id",
  "first_name",
  "last_name",
  "person_type",
  "membership_type",
  "membership_status",
  "shares_number",
  "tags"
];
for (const col of startingColumns) {
  selectedColumns.value.push(columns.find((c) => c.field === col));
}

// Copy emails to clipboard
function copyEmails() {
  const emails = selectedMembers.value
    .filter((m) => m.email)
    .map((m) => m.email)
    .join(", ");
  navigator.clipboard.writeText(emails).then(
  () => {
    // clipboard successfully set
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Emails copied to clipboard.",
      life: 5000,
    });
  },
  () => {
    // clipboard write failed
    toast.add({
      severity: "failure",
      summary: "Failure",
      detail: "Could not copy emails to clipboard.",
      life: 5000,
    });
  }
  );
}

// List of windscribe color classes
const bgClasses = [
  "bg-indigo-200",
  "bg-cyan-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-red-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-blue-200",
  "bg-gray-200",
];

// Get background color class for key of choices
function keyToBgClass(i: number) {
  return bgClasses[i % bgClasses.length];
}

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
            :placeholder="t('Columns')"
            :maxSelectedLabels="0"
            :selectedItemsLabel="t('Columns')"
            scrollHeight="400px"
            class="w-26"
          />
        </div>
      </template>
      <template #end>
        <div class="mx-2">
        <Button
          :label="t('Copy emails')"
          :disabled="!(selectedMembers.length>0)"
          @click="copyEmails">
        </Button>
        </div>
        <Button :label="t('Export CSV')" :disabled="!(selectedMembers?.length>0)">
          <JsonCSV
            v-if="selectedMembers?.length>0"
            :data="selectedMembers"
            :name="t('members') + '.csv'"
          >{{t('Export CSV')}}</JsonCSV>
        </Button>
      </template>
    </Toolbar>

    <DataTable
      :value="members.results"
      v-model:selection="selectedMembers"
      dataKey="id"
      ref="datatable"
      :paginator="true"
      :rows="100"
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
      filterDisplay="menu"
      v-model:filters="filters"
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
        :sortable="true"
        :filter="col.filter"
      >
        <!-- TODO Bulk Edit Button -->
        <!-- <template #header>
            <Button type="button" icon="pi pi-cog"></Button>
        </template> -->

        <!-- Body for choices -->
        <template #body="{data}" v-if="col.choices != undefined">

          <!-- Handle data[col.field] is array -->
          <div v-if="Array.isArray(data[col.field])">
            <div v-for="item in data[col.field]" :key="item" class="c-tag" :class="keyToBgClass(col.choices.find((c:any) => c.value == item).key)">
              {{ col.choices.find((c:any) => c.value == item).label }}
            </div>
          </div>
          <div v-else-if="data[col.field] != null" class="c-tag" :class="keyToBgClass(col.choices.find((c:any) => c.value == data[col.field]).key)">
            {{ col.choices.find((c:any) => c.value == data[col.field]).label }}
          </div>
        </template>

        <!-- Filter for choices -->
        <template #filter="{filterModel}" v-if="col.choices != undefined">

          <!-- Multiple choice -->
          <MultiSelect v-if="col.inputType == 'multiselect'"
              v-model="filterModel.value" :options="col.choices"
              optionLabel="label" optionValue="value" placeholder="Any"
              class="p-column-filter">
            <template #option="slotProps">
                <div class="p-multiselect-representative-option">
                    <span>{{slotProps.option.label}}</span>
                </div>
            </template>
          </MultiSelect>

          <!-- Single choice -->
          <Dropdown v-else
          v-model="filterModel.value" :options="col.choices"
          optionLabel="label" optionValue="value" placeholder="Any"
          class="p-column-filter"
          :showClear="true"
          >
          <template #value="slotProps">
            <span class="px-1 py-0.5" :class="keyToBgClass(col.choices.find((c:any) => c.value == slotProps.value).key)" v-if="slotProps.value">
              {{ col.choices.find((c:any) => c.value === slotProps.value).label }}
            </span>
            <span v-else>{{slotProps.placeholder}}</span>
          </template>
          <template #option="slotProps">
            <span class="px-1 py-0.5" :class="keyToBgClass(slotProps.option.key)">
              {{t(slotProps.option.label)}}
            </span>
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
            class="p-button-sm"
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
.p-button-sm {
  padding: 3px 6px 3px 6px ;
  width: auto;
}

.c-tag {
  padding: 2px 4px 1px 4px;
  font-size: 12px;
  width: min-content;
  border-radius: 0.1rem;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
</style>
