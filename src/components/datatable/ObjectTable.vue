<script setup lang="ts">
import type { endpoints } from "@/api/api";
import type { StoreGeneric } from "pinia";
import PrimeButton from "primevue/button";
import PrimeColumn from "primevue/column";
import PrimeDataTable from "primevue/datatable";
import PrimeDropdown from "primevue/dropdown";
import PrimeInputSwitch from "primevue/inputswitch";
import PrimeInputText from "primevue/inputtext";
import PrimeMultiSelect from "primevue/multiselect";
import type { PropType } from "vue";
import { ref, watch } from "vue";
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
]);

// Formatting functions for data view in table ----------------------------- //
function formatDateTime(date: string) {
  return new Date(date).toLocaleString("de-AT");
}
function formatMultiSelect(data: any) {
  const len = Array.isArray(data) ? data.length : 0;
  const str = len !== 1 ? t("entries") : t("entry");
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

// Filter --------------------------------------------------------------- //
function filter($event: any) {
  const sort = `${$event.sortOrder === -1 ? "-" : ""}${$event.sortField}`;
  let filter = "";

  Object.keys($event.filters).forEach((key: any) => {
    if ($event.filters[key].constraints[0].value !== null) {
      if (
        !(
          $event.filters[key].constraints[0].matchMode === "equals" &&
          typeof $event.filters[key].constraints[0].value !== "string"
        )
      ) {
        filter = `${filter}&${key}${dataTableFilterModesToDjangoFilter(
          $event.filters[key].constraints[0].matchMode
        )}=${$event.filters[key].constraints[0].value}`;
      } else {
        $event.filters[key].constraints[0].value.forEach((value: any) => {
          filter = `${filter}&${key}${dataTableFilterModesToDjangoFilter(
            $event.filters[key].constraints[0].matchMode
          )}=${value}`;
        });
      }
    }
  });
  props.store.filter(props.name, $event, sort, filter);
}

function dataTableFilterModesToDjangoFilter(filterMode: string) {
  switch (filterMode) {
    case "startsWith":
      return "__istartswith";
    case "contains":
      return "__icontains";
    case "endsWith":
      return "__iendswith";
    case "equals":
    case "exact":
      return "";
    case "notEquals":
      console.log("Unknown filter mode: " + filterMode);
      return "__exact";
    case "in":
      return "__in";
    case "lt":
      return "__lt";
    case "lte":
      return "__lte";
    case "gt":
      return "__gt";
    case "gte":
      return "__gte";
    case "between":
      return "__range";
    case "is":
      return "__isnull";
    case "isNot":
      console.log("Unknown filter mode: " + filterMode);
      return "__isnull";
    case "isNull":
      return "__isnull";
    case "inList":
      return "__in";
    default:
      console.log("Unknown filter mode: " + filterMode);
      return "__icontains";
  }
}
</script>

<template>
  <div class="datatable">
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
      :rowsPerPageOptions="[10, 20, 50, 100, 10000]"
      :currentPageReportTemplate="
        t('Showing') +
        ' {first} ' +
        t('to') +
        ' {last} ' +
        t('of') +
        ' {totalRecords}'
      "
      class="p-datatable-sm object-table"
      filterDisplay="menu"
      :striped-rows="true"
      v-model:filters="filters"
      :resizableColumns="true"
      columnResizeMode="expand"
      :scrollable="true"
      scrollHeight="flex"
      @page="filter"
      @filter="filter"
      @sort="filter"
    >
      <!-- Selection column -->
      <PrimeColumn
        selectionMode="multiple"
        style="padding-left: 13px; width: 40px; max-width: 40px"
        :frozen="true"
      ></PrimeColumn>

      <!-- Edit column -->
      <PrimeColumn style="width: 45px; max-width: 45px" :frozen="true">
        <template #header
          ><PrimeButton
            icon="pi pi-pencil"
            class="p-button-text p-button-sm button-edit"
            disabled="true"
        /></template>
        <template #body="slotProps">
          <PrimeButton
            icon="pi pi-pencil"
            class="p-button-text p-button-sm button-edit"
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
        :show-filter-operator="false"
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
            {{ t(col.choices[data[col.field]]) }}
          </div>
        </template>
        <template #body="{ data }" v-else-if="col.input_type == 'multiselect'">
          <!-- TODO: Inspect function to show objects -->
          {{ t(formatMultiSelect(data[col.field])) }}
        </template>
        <template #body="{ data }" v-else>
          <!-- TODO: Inspect function to show objects -->
          {{ t(formatGeneric(data[col.field])) }}
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
                :placeholder="t('Select multiple choices')"
                class="p-column-filter"
              >
                <template #option="slotProps">
                  <div class="p-multiselect-representative-option">
                    <span>{{ t(slotProps.option.label) }}</span>
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
                    {{ t(col.choices[slotProps.value]) }}
                  </span>
                  <span v-else>{{ t(slotProps.placeholder) }}</span>
                </template>
                <template #option="slotProps">
                  <span class="tag">
                    {{ t(slotProps.option.label) }}
                  </span>
                </template>
              </PrimeDropdown>
            </div>
            <div v-else-if="col.input_type == 'date'">
              {{ t("Date filter not implemented yet") }}
              <!-- TODO Filter doesn't work yet -->
              <!-- <PrimeCalendar v-model="filterModel.value" /> -->
            </div>
            <div v-else-if="col.input_type == 'datetime'">
              {{ t("Datetime filter not implemented yet") }}
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

<style scoped lang="scss">
.datatable {
  width: 100%;
  height: 100%;
  background: #fff;
  border: 1px solid #e0e0e0;
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

.button-edit {
  padding: 6px !important;
  width: 30px !important;
}

// Hide filter-add-rule button until feature is available
:global(.p-column-filter-add-rule) {
  display: none;
}
</style>
