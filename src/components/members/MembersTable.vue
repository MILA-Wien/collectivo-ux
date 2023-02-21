<script setup lang="ts">
import { ref, watch } from "vue";
import MultiSelect from "primevue/multiselect";
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
import ObjectDetailLoader from "@/components/datatable/ObjectDetailLoader.vue";
import ObjectTable from "@/components/datatable/ObjectTable.vue";
import MembersBulkEdit from "./MembersBulkEdit.vue";
import Toolbar from "primevue/toolbar";
import PrimeButton from "primevue/button";
import { FilterOperator } from "primevue/api";
import JsonCSV from "vue-json-csv";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import type { PropType } from "vue";
import { storeToRefs, type StoreGeneric } from "pinia";
import type { endpoints } from "@/api/api";
import { matchModes, getDefaultMatchMode } from "@/helpers/filters";

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
  emailCampaignSchema: {
    type: Object,
    required: true,
  },
});

const toast = useToast();
const selectedMember = ref({ id: null });

const editMember = ref(false);
const editMemberCreate = ref(false); // TODO: Remove this
const createMember = ref(false);

function createObjectFn() {
  createMember.value = true;
}

// Update content of selected members is objects are changed in store
const selectedMembers = ref<any[]>([]);
const { membersSummary } = storeToRefs(props.store);
watch(membersSummary.value, () => {
  const temp_selected = JSON.parse(JSON.stringify(selectedMembers.value));
  selectedMembers.value = [];
  for (const oldData of temp_selected) {
    const newData = props.objects.find((m: any) => m.id === oldData.id);
    selectedMembers.value.push(newData);
  }
});

// Filter functions (match modes) ------------------------------------------ //
const filters = ref<{ [key: string]: any }>({});
function clearFilters() {
  for (const value of Object.values(filters.value)) {
    value.constraints[0].value = null;
  }
}

// Data columns ------------------------------------------------------------ //
const columns: any[] = [];
const selectedColumns = ref<any[]>([]);

var column_index = 0;
for (const [key, value] of Object.entries(props.schema)) {
  columns.push({
    field: key,
    header: t(value.label),
    input_type: value.input_type,
    index: ++column_index,
  });

  // Set default filters
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

// Set default columns
// TODO: Load default columns from schema
const defaultColumns = [
  "id",
  "first_name",
  "last_name",
  "person_type",
  "membership_type",
  "shares_number",
  "tags",
];
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

// Extra tools ------------------------------------------------------------- //
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

// Send emails
const editActive = ref(false);
const editObject = ref({});
const editCreate = ref(false);
function sendEmails() {
  editObject.value = {
    recipients: selectedMembers.value.map((m) => m.id),
  };
  editCreate.value = true;
  editActive.value = true;
}

// Bulk edit
const bulkEditIsActive = ref(false);
function bulkEdit() {
  bulkEditIsActive.value = true;
}
function filter($event: any) {
  const sort = `${$event.sortOrder === -1 ? "-" : ""}${$event.sortField}`;
  props.store.filter(props.name, $event, sort);
}
</script>

<template>
  <div class="flex flex-col h-full" id="members-table">
    <Toolbar class="mb-4">
      <template #start>
        <div class="m-1 text-left">
          <PrimeButton
            :label="t('Create')"
            @click="createObjectFn()"
            class="p-button-success"
          >
          </PrimeButton>
        </div>
        <div class="m-1 text-left">
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
        <div class="m-1">
          <PrimeButton
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            class="p-button-outlined"
            @click="clearFilters()"
          >
          </PrimeButton>
        </div>
        <div class="m-1">
          <PrimeButton
            :label="t('Bulk edit')"
            :disabled="!(selectedMembers.length > 0)"
            @click="bulkEdit"
          >
          </PrimeButton>
        </div>
        <div class="m-1">
          <PrimeButton
            :label="t('Send emails')"
            :disabled="!(selectedMembers.length > 0)"
            @click="sendEmails"
          >
          </PrimeButton>
        </div>
        <div class="m-1">
          <PrimeButton
            :label="t('Copy emails')"
            :disabled="!(selectedMembers.length > 0)"
            @click="copyEmails"
          >
          </PrimeButton>
        </div>
        <div class="m-1">
          <PrimeButton
            :label="t('Export CSV')"
            :disabled="!(selectedMembers?.length > 0)"
          >
            <JsonCSV
              v-if="selectedMembers?.length > 0"
              :data="selectedMembers"
              :name="t('members') + '.csv'"
              >{{ t("Export CSV") }}</JsonCSV
            >
          </PrimeButton>
        </div>
      </template>
    </Toolbar>

    <!-- Data Table -->
    <div class="grow overflow-auto bg-white">
      <ObjectTable
        :store="props.store"
        :name="name"
        :objects="objects"
        :schema="schema"
        :matchModes="matchModes"
        :selectedColumns="selectedColumns"
        v-model:filters="filters"
        v-model:selectedObjects="selectedMembers"
        v-model:editObject="selectedMember"
        v-model:editActive="editMember"
        v-model:editCreate="editMemberCreate"
        @page="filter"
        @filter="filter"
        @sort="filter"
      />
    </div>
  </div>
  <!-- members-table flex-col -->

  <!-- Dialogue for member details -->
  <ObjectDetailLoader
    v-if="editMember"
    :id="selectedMember.id"
    :create="false"
    :store="props.store"
    :name="'membersMembers'"
    @close="editMember = false"
  />

  <!-- Dialogue for member creation -->
  <ObjectDetailLoader
    v-if="createMember"
    :create="true"
    :store="props.store"
    :name="'membersCreate'"
    @close="createMember = false"
  />

  <!-- Dialogue for email campaign details -->
  <ObjectDetail
    v-if="editActive"
    :object="editObject"
    :create="editCreate"
    :store="props.store"
    :name="'membersEmailsCampaigns'"
    :schema="emailCampaignSchema"
    @close="editActive = false"
  />

  <!-- Dialogue for member bulk edit -->
  <MembersBulkEdit
    v-if="bulkEditIsActive"
    :members="selectedMembers"
    :schema="schema"
    @close="bulkEditIsActive = false"
  />
</template>
