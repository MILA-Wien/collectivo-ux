<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import PrimeButton from "primevue/button";
import PrimeDialog from "primevue/dialog";
import PrimeDropdown from "primevue/dropdown";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["change", "close"]);

const mainStore = useMainStore();

const toast = useToast();
const successToast = () => {
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "User has been updated.",
    life: 5000,
  });
};
const errorToast = (e: any) => {
  toast.add({
    severity: "error",
    summary: "Error",
    detail: `Update failed. Request-id: "${
      e?.response?.headers["x-request-id"]
    }" Response: "${JSON.stringify(e?.response?.data)}"`,
  });
};

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

const displayModal = ref(true);
const isSaving = ref(false);

const actions = {
  "Add an object": addObject,
  "Remove an object": removeObject,
};

const chosenAction = ref<keyof typeof actions | null>(null);
const chosenColumn = ref<any>(null);
const chosenContent = ref<any>(null);

// Create temporary copy of the object
const members_temp = ref(JSON.parse(JSON.stringify(props.members)));

const columns: any[] = [];
for (const [key, value] of Object.entries(props.schema)) {
  columns.push({
    field: key,
    header: t(value.label),
    input_type: value.input_type,
  });

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

function getActions(input_type: any): (keyof typeof actions)[] {
  if (input_type == "multiselect") {
    return ["Add an object", "Remove an object"];
  }
  return [];
}

function getOptions(column: any) {
  return column.choices;
}

function closeModal() {
  emit("close");
}

function addObject(member: any, field: any, object: any) {
  if (member[field].includes(object)) {
    return;
  }
  member[field].push(object);
}

function removeObject(member: any, field: any, object: any) {
  member[field] = member[field].filter((item: any) => item != object);
}

async function save() {
  isSaving.value = true;
  try {
    const promises: any[] = [];
    const actionFn = actions[chosenAction.value!];
    for (const member of members_temp.value) {
      actionFn(member, chosenColumn.value.field, chosenContent.value);
      promises.push(mainStore.update("profilesProfiles", member, member.id));
    }
    await Promise.all(promises);
    successToast();
  } catch (error) {
    errorToast(error);
    console.log(error);
  }
  emit("close");
  isSaving.value = false;
}
</script>

<template>
  <div>
    <PrimeDialog
      :header="
        t('Bulk edit selected') + ' ' + members.length + ' ' + t('members')
      "
      v-model:visible="displayModal"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
      :modal="true"
      @hide="closeModal"
    >
      <div class="modal-content">
        <!-- Choose column -->
        <h3>{{ t("Attribute") }}</h3>
        <PrimeDropdown
          v-model="chosenColumn"
          :options="columns"
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
        <div v-if="chosenColumn">
          <h3>{{ t("Action type") }}</h3>
          <PrimeDropdown
            v-if="getActions(chosenColumn.input_type).length > 0"
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
        <div v-if="chosenAction">
          <h3>{{ t("Action data") }}</h3>
          <PrimeDropdown
            v-if="chosenColumn.input_type == 'multiselect'"
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

      <template #footer>
        <PrimeButton
          :label="t('Cancel')"
          icon="pi pi-times"
          @click="closeModal"
          class="p-button-text"
        />
        <PrimeButton
          :label="t('Save')"
          :loading="isSaving"
          :disabled="!chosenContent"
          icon="pi pi-check"
          @click="save()"
          autofocus
        />
      </template>
    </PrimeDialog>
  </div>
</template>
<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label {
  font-weight: bold;
}
</style>
