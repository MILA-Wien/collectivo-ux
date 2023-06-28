<script setup lang="ts">
import type { Schema } from "@/api/types";
import { checkCondition } from "@/helpers/schema";
import { errorToast, successToast } from "@/helpers/toasts";
import type { StoreGeneric } from "pinia";
import PrimeButton from "primevue/button";
import PrimeDialog from "primevue/dialog";
import PrimeDropdown from "primevue/dropdown";
import { useToast } from "primevue/usetoast";
import type { PropType } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["change", "close"]);

const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  objects: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array as PropType<any>,
    required: true,
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
});

// Modal state ----------------------------------------------------------------
const isVisible = ref(true);

function getHeader() {
  return (
    t("Bulk edit") +
    ": " +
    t(props.schema.label) +
    " (" +
    String(props.objects.length) +
    " " +
    t("selected") +
    ")"
  );
}

function closeModal() {
  emit("close");
}

const isSaving = ref(false);

function addEntry(object: any, field: any, entry: any) {
  // TODO: Figure out why a conversion is necessary here
  entry = Number(entry);
  if (object[field].includes(entry)) {
    return;
  }
  object[field].push(entry);
}

function removeEntry(object: any, field: any, entry: any) {
  entry = Number(entry);
  object[field] = object[field].filter((item: any) => item != entry);
}

const actions = {
  "Add an object": addEntry,
  "Remove an object": removeEntry,
};

const allowed_columns = ref<any>([]);
for (const column of props.columns) {
  if (!checkCondition(column, props.schema.fields[column.field]?.read_only)) {
    allowed_columns.value.push(column);
  }
}
const toast = useToast();
const chosenAction = ref<keyof typeof actions | null>(null);
const chosenColumn = ref<any>(null);
const chosenContent = ref<any>(null);

// Create temporary copy of the object
const objects_temp = ref(JSON.parse(JSON.stringify(props.objects)));

function getActions(input_type: any): (keyof typeof actions)[] {
  if (input_type == "multiselect") {
    return ["Add an object", "Remove an object"];
  }
  return [];
}

function getOptions(column: any) {
  return column.choice_list;
}

async function save() {
  isSaving.value = true;
  try {
    const actionFn = actions[chosenAction.value!];
    for (const object of objects_temp.value) {
      actionFn(object, chosenColumn.value.field, chosenContent.value);
    }
    await props.store.updateBulk(props.name, objects_temp.value);
    successToast(toast, "Changes have been saved.");
  } catch (error) {
    errorToast(toast, error);
  }
  emit("close");
  isSaving.value = false;
}
</script>

<template>
  <div>
    <PrimeDialog
      :header="getHeader()"
      class="object-detail"
      v-model:visible="isVisible"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '80vw' }"
      :modal="true"
      :maximizable="true"
      @hide="closeModal"
    >
      <div class="modal-content">
        <!-- Choose column -->
        <h3>{{ t("Attribute") }}</h3>
        <PrimeDropdown
          v-model="chosenColumn"
          :options="allowed_columns"
          optionLabel="header"
          class="p-column-filter"
          placeholder="Select an attribute"
          :filter="true"
        >
          <template #value="slotProps">
            <span v-if="slotProps.value">{{ slotProps.value.header }}</span>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <span class="px-1 py-0.5">
              {{ t(slotProps.option.header) }}
            </span>
          </template>
        </PrimeDropdown>

        <!-- Choose action -->
        <div>
          <h3>{{ t("Action type") }}</h3>
          <PrimeDropdown
            v-if="!chosenColumn"
            :disabled="true"
            placeholder="Select an action"
          >
          </PrimeDropdown>
          <PrimeDropdown
            v-else-if="getActions(chosenColumn.input_type).length > 0"
            v-model="chosenAction"
            :options="getActions(chosenColumn.input_type)"
            class="p-column-filter"
            :disabled="!chosenColumn"
            placeholder="Select an action"
            :filter="true"
          >
          </PrimeDropdown>
          <div v-else>No bulk edit action available for this column.</div>
        </div>

        <!-- Choose data -->
        <div>
          <h3>{{ t("Action data") }}</h3>
          <PrimeDropdown
            v-if="!chosenAction"
            :disabled="true"
            placeholder="Select data for this action"
          >
          </PrimeDropdown>
          <PrimeDropdown
            v-else-if="chosenColumn.input_type == 'multiselect'"
            v-model="chosenContent"
            :options="getOptions(chosenColumn)"
            class="p-column-filter"
            placeholder="Select data for this action"
            optionLabel="label"
            optionValue="value"
            :filter="true"
          >
          </PrimeDropdown>

          <div v-else>This action is not yet supported.</div>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <div
          class="object-detail-filter flex flex-row flex-wrap mt-5 items-center gap-3"
        >
          <div class="flex-grow"></div>
          <div class="flex flex-row flex-wrap gap-3">
            <PrimeButton
              :label="t('Save')"
              icon="pi pi-check"
              class="flex-none"
              @click="save"
            />
            <PrimeButton
              :label="t('Cancel')"
              icon="pi pi-times"
              @click="closeModal"
              class="p-button-secondary flex-none"
            />
          </div>
        </div>
      </template>
    </PrimeDialog>
  </div>
</template>

<style scoped>
label {
  font-weight: bold;
}
</style>
