<script setup lang="ts">
import { ref, watch } from "vue";
import PrimeDataTable from "primevue/datatable";
import PrimeColumn from "primevue/column";
import PrimeButton from "primevue/button";
import PrimeDropdown from "primevue/dropdown";
import PrimeMultiSelect from "primevue/multiselect";
import PrimeInputText from "primevue/inputtext";
import PrimeInputSwitch from "primevue/inputswitch";
import type { PropType } from "vue";
import type { StoreGeneric } from "pinia";
import type { endpoints } from "@/api/api";
import { useI18n } from "vue-i18n";
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
  filters: {
    type: Object,
    required: true,
  },
  matchModes: {
    type: Object,
    required: true,
  },
  selectedObjects: {
    type: Object as PropType<any[]>,
    required: true,
  },
  selectedColumns: {
    type: Object as PropType<any[]>,
    required: true,
  },
  editObject: {
    type: Object,
    required: true,
  },
  editActive: {
    type: Boolean,
    required: true,
  },
  editCreate: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits([
  "update:editCreate",
  "update:editActive",
  "update:editObject",
  "update:selectedObjects",
  "update:selectedColumns",
  "update:filters",
  "page",
  "sort",
  "filter",
]);

// Formatting functions for data view in table ----------------------------- //
function formatDateTime(date: string) {
  return new Date(date).toLocaleString("de-AT");
}
function formatMultiSelect(data: any) {
  const len = Array.isArray(data) ? data.length : 0;
  const str = len !== 1 ? "objects" : "object";
  return `${len} ${t(str)}`;
}
function formatGeneric(data: string | null) {
  // Shorten strings that are longer than 30 characters
  if (data == undefined) {
    return "";
  }
  if (data.length > 30) {
    return data.substring(0, 30) + "...";
  }
  return data;
}

// Datatable --------------------------------------------------------------- //
const datatable = ref();
const selectedObjects = ref(props.selectedObjects);
watch(selectedObjects, (val) => {
  emit("update:selectedObjects", val);
});
const filters = ref(props.filters);
watch(filters, (val) => {
  emit("update:filters", val);
});

// Dialogues --------------------------------------------------------------- //
function editObjectFn(event: any) {
  emit("update:editObject", event);
  console.log(event);
  emit("update:editCreate", false);
  emit("update:editActive", true);
}
const totalRecords = ref(0);
watch(
  () => props.store[props.name].totalRecords,
  (val) => {
    totalRecords.value = val;
  },
  { immediate: true }
);
</script>

<template>
  <div class="datatable" style="height: 100%; width: 100%">
    <PrimeDataTable
      :value="objects"
      v-model:selection="selectedObjects"
      dataKey="id"
      ref="datatable"
      :lazy="true"
      :paginator="true"
      :rows="50"
      :totalRecords="totalRecords"
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
      showGridlines
      class="p-datatable-sm object-table"
      filterDisplay="menu"
      v-model:filters="filters"
      :resizableColumns="true"
      columnResizeMode="fit"
      :scrollable="true"
      scrollHeight="flex"
      @page="emit('page', $event)"
      @filter="emit('filter', $event)"
      @sort="emit('sort', $event)"
    >
      <!-- Selection column -->
      <PrimeColumn
        selectionMode="multiple"
        style="width: 50px; max-width: 50px"
        :frozen="true"
      ></PrimeColumn>
      <!-- Edit column -->
      <PrimeColumn style="width: 50px; max-width: 50px" :frozen="true">
        <template #body="slotProps">
          <PrimeButton
            icon="pi pi-pencil"
            class="p-button-text p-button-sm"
            @click="editObjectFn(slotProps.data)"
          />
        </template>
      </PrimeColumn>
      <!-- Content columns -->
      <PrimeColumn
        v-for="col of selectedColumns"
        :header="col.header"
        :key="col.field"
        :field="col.field"
        :sortable="true"
        :filterMatchModeOptions="matchModes[col.input_type]"
      >
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
        <template #body="{ data }" v-else>
          <!-- TODO: Inspect function to show objects -->
          {{ formatGeneric(data[col.field]) }}
        </template>

        <!-- Custom filters for different input types -->
        <template #filter="{ filterModel }">
          <div>
            <div v-if="col.input_type == 'multiselect'">
              <!-- Multiple choice -->
              <PrimeMultiSelect
                v-model="filterModel.value"
                :options="col.choice_list"
                optionLabel="label"
                optionValue="value"
                :maxSelectedLabels="0"
                :selectedItemsLabel="`${filterModel.value?.length} selected`"
                :filter="true"
                placeholder="Select multiple choices"
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
            <div v-else-if="filterModel.matchMode == 'isNull'">
              <PrimeInputSwitch
                v-model="filterModel.value"
                class="p-column-filter"
              />
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
      </PrimeColumn>
    </PrimeDataTable>
  </div>
</template>

<style lang="scss">
.object-table.p-component {
  font-size: 14px;
}
.p-datatable.p-datatable-gridlines .p-paginator-bottom {
  border-width: 1px 1px 1px 1px;
}
.object-table.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td,
.object-table.p-datatable.p-datatable-sm .p-datatable-tbody > tr > th {
  padding: 5px 10px 5px 10px;
  word-break: break-all;
  // vertical-align: middle;
  // white-space: normal;
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
