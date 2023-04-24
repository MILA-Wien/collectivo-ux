<script setup lang="ts">
import type { endpoints } from "@/api/api";
import ObjectEditor from "@/components/datatable/ObjectEditor.vue";
import { errorToast, successToast } from "@/helpers/toasts";
import type { StoreGeneric } from "pinia";
import { storeToRefs } from "pinia";
import PrimeButton from "primevue/button";
import PrimeCalendar from "primevue/calendar";
import PrimeConfirmDialog from "primevue/confirmdialog";
import PrimeDialog from "primevue/dialog";
import PrimeDropdown from "primevue/dropdown";
import PrimeInputSwitch from "primevue/inputswitch";
import PrimeInputText from "primevue/inputtext";
import PrimeMultiSelect from "primevue/multiselect";
import PrimeTextarea from "primevue/textarea";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { PropType } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["change", "close"]);
const toast = useToast();
const confirm = useConfirm();

// define possible actions types
type Action = {
  action: "Submit" | "Save" | "Delete" | "Cancel";
  label?: string;
  icon?: string;
  color?: string;
  confirm?: boolean;
  confirmText?: string;
  confirmHeader?: string;
  confirmIcon?: string;
  confirmRejectLabel?: string;
  confirmAcceptLabel?: string;
};

const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String as PropType<keyof typeof endpoints>,
    required: true,
  },
  header: {
    type: String,
    required: false,
  },
  actions: {
    type: Object as PropType<Action[]>,
  },
  id: {
    type: String,
    required: false,
  },
  object: {
    type: Object,
    required: false,
  },
});

// Create temporary copy of the object
const object_temp = ref(JSON.parse(JSON.stringify(props.object)));

// Reactive settings
const isVisible = ref(true);
const isSaving = ref(false);
const toasts = ref();

// Get data.
const error = ref<Object | null>(null);
const data = storeToRefs(props.store)[props.name];

// Load data
if (!props.store[props.name].schemaLoaded) {
  props.store.getSchema(props.name).catch((e: any) => {
    error.value = e;
  });
}

// Functions
function formatDates() {
  for (const [key, value] of Object.entries(object_temp.value)) {
    if (value instanceof Date) {
      object_temp.value[key] = value.toISOString().split("T")[0];
    }
  }
}
async function createObject() {
  isSaving.value = true;
  formatDates();
  try {
    await props.store.create(props.name, object_temp.value);
    successToast(toast, "Object has been created.");
    emit("close");
  } catch (error) {
    console.log(error);
    errorToast(toast, error);
  }
  isSaving.value = false;
}
async function updateObject() {
  isSaving.value = true;
  formatDates();
  try {
    await props.store.update(
      props.name,
      object_temp.value,
      object_temp.value["id"]
    );
    successToast(toast, "Object has been updated.");
    emit("close");
  } catch (error) {
    console.log(error);
    errorToast(toast, error);
  }
  isSaving.value = false;
}
async function deleteObject() {
  isSaving.value = true;
  try {
    await props.store.delete(props.name, object_temp.value["id"]);
    successToast(toast, "Object has been deleted.");
  } catch (error) {
    console.log(error);
    errorToast(toast, error);
  }
  emit("close");
  isSaving.value = false;
}
const confirmDelete = () => {
  confirm.require({
    message: "Are you sure you want to delete this object?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      deleteObject();
    },
  });
};

const actionFunctions: { [key: string]: Function } = {
  Submit: createObject,
  Save: updateObject,
  Delete: deleteObject,
  Cancel: (): void => emit("close"),
};

const performAction = (action: Action) => {
  if (action.confirm) {
    confirm.require({
      message: action.confirmText,
      header: action.confirmHeader,
      icon: action.confirmIcon,
      acceptLabel: action.confirmAcceptLabel,
      rejectLabel: action.confirmRejectLabel,
      accept: () => {
        actionFunctions[action.action]();
      },
    });
  } else {
    actionFunctions[action.action]();
  }
};

// Check if a schema condition is true
function checkCondition(condition: any) {
  if (condition == null) {
    return true;
  }
  let cond = object_temp.value[condition.field] == condition.value;
  return cond;
}
</script>

<template>
  <SuccessToast ref="toasts"></SuccessToast>
  <div>
    <PrimeConfirmDialog></PrimeConfirmDialog>
    <PrimeDialog
      :header="props.header ? t(props.header) : props.name"
      class="object-detail"
      v-model:visible="isVisible"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '80vw' }"
      :modal="true"
      :maximizable="true"
      @hide="emit('close')"
    >
      <div class="mt-5" v-if="!data.schemaLoaded">Loading...</div>
      <div class="mt-5" v-else>
        <!-- Editable fields based on input type -->
        <div v-for="(field, name, i) in data.schema" :key="i">
          <div class="my-4">
            <div>
              <div class="mb-1">
                <label for="attr-{{name}}">
                  {{ t(field.label) }}
                  <span v-if="field.required" class="text-red-600">*</span>
                </label>
              </div>

              <div v-if="field.input_type === 'select'">
                <PrimeDropdown
                  v-model="object_temp[name]"
                  :options="field.options"
                  optionLabel="label"
                  optionValue="value"
                  :filter="true"
                  :placeholder="t('Select a choice')"
                  :showClear="true"
                  class="w-full"
                  :disabled="field.read_only"
                />
              </div>

              <div v-else-if="field.input_type === 'multiselect'">
                <PrimeMultiSelect
                  v-model="object_temp[name]"
                  :options="field.options"
                  optionLabel="label"
                  optionValue="value"
                  :maxSelectedLabels="0"
                  :selectedItemsLabel="`${object_temp[name]?.length} selected`"
                  :filter="true"
                  :placeholder="t('Select multiple choices')"
                  class="w-full"
                  :disabled="field.read_only"
                />
              </div>

              <div
                v-else-if="field.input_type === 'checkbox'"
                class="flex flex-row"
              >
                <PrimeInputSwitch
                  v-model="object_temp[name]"
                  :disabled="field.read_only"
                  class="flex-none mr-2"
                />
                <small
                  v-if="field.help_text"
                  id="user-attr-{{value}}-help"
                  class="p-info"
                  >{{ field.help_text }}</small
                >
              </div>

              <div v-else-if="field.input_type === 'date'">
                <PrimeCalendar
                  v-model="object_temp[name]"
                  dateFormat="dd.mm.yy"
                  :disabled="field.read_only"
                />
              </div>

              <div v-else-if="field.input_type === 'textarea'">
                <PrimeTextarea
                  v-model="object_temp[name]"
                  :disabled="field.read_only"
                />
              </div>

              <div v-else-if="field.input_type === 'html'">
                <object-editor v-model="object_temp[name]"></object-editor>
              </div>

              <div v-else>
                <PrimeInputText
                  id="attr-{{name}}"
                  type="text"
                  aria-describedby="attr-{{value}}-help"
                  v-model="object_temp[name]"
                  :disabled="field.read_only"
                  class="w-full"
                />
              </div>

              <small
                v-if="field.help_text && field.input_type !== 'checkbox'"
                id="user-attr-{{value}}-help"
                class="p-info"
                >{{ t(field.help_text) }}</small
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <div
          class="object-detail-filter flex flex-row flex-wrap mt-5 items-center gap-3"
        >
          <div class="flex-grow h-11" />
          <div class="flex flex-row flex-wrap gap-3">
            <div v-for="action in actions">
              <PrimeButton
                :label="t(action.label ? action.label : 'Save')"
                :loading="isSaving"
                icon="pi pi-check"
                class="p-button-success flex-none"
                @click="performAction(action)"
              />
            </div>
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

<style lang="scss">
.object-detail.p-dialog .p-dialog-header,
.object-detail.p-dialog .p-dialog-footer {
  background-color: rgb(236, 236, 236);
}
.object-detail.p-dialog .p-inputtextarea {
  height: 40px;
  width: 100%;
}
.object-detail.p-dialog .p-calendar {
  width: 100%;
}
.object-detail.p-dialog .p-dialog-footer button {
  margin-right: 0px;
}
</style>
