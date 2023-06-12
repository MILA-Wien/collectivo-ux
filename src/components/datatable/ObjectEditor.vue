<script setup lang="ts">
import type { Schema } from "@/api/types";
import { errorToast, successToast } from "@/helpers/toasts";
import type { StoreGeneric } from "pinia";
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
import FieldRichText from "./FieldRichText.vue";

const { t } = useI18n();
const emit = defineEmits(["change", "close"]);

const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  object: {
    type: Object,
    required: true,
  },
  create: {
    type: Boolean,
    required: true,
  },
  allow_delete: {
    type: Boolean,
    default: true,
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
});

// Create temporary copy of the object
const object_temp = ref(JSON.parse(JSON.stringify(props.object)));

// Upload callback
const pending_uploads = <any>ref({});
const onUpload = (event: any, name: any) => {
  pending_uploads.value[name] = URL.createObjectURL(event.target.files[0]);
  object_temp.value[name] = event.target.files[0];
};
const removeUpload = (name: any) => {
  if (pending_uploads[name] != undefined) {
    pending_uploads.value[name] = null;
  }
  object_temp.value[name] = "";
};

// Reactive settings
const isVisible = ref(true);
const isSaving = ref(false);

// Functions
function closeModal() {
  emit("close");
}

function createSubmitData() {
  // Format dates
  for (const [key, value] of Object.entries(object_temp.value)) {
    if (value instanceof Date) {
      object_temp.value[key] = value.toISOString().split("T")[0];
    }
  }

  // Generate form data (needed for files)
  let submitData = new FormData();
  for (const key of Object.keys(object_temp.value)) {
    if (object_temp.value[key] !== undefined) {
      // Special case for images
      if (props.schema.fields[key].input_type == "image") {
        // Submit image only if changed or removed
        if (object_temp.value[key] instanceof File) {
          submitData.append(key, object_temp.value[key]);
        } else if (object_temp.value[key] == "") {
          submitData.append(key, object_temp.value[key]);
        }
      }
      // Other fields
      else {
        submitData.append(key, object_temp.value[key]);
      }
    }
  }
  return submitData;
}

async function createObject() {
  isSaving.value = true;
  try {
    await props.store.create(props.name, createSubmitData());
    successToast(toast, "Object has been created.");
    emit("close");
  } catch (error) {
    errorToast(toast, error);
  }
  isSaving.value = false;
}

async function updateObject() {
  isSaving.value = true;
  try {
    await props.store.update(
      props.name,
      createSubmitData(),
      object_temp.value["id"]
    );
    successToast(toast, "Object has been updated.");
    emit("close");
  } catch (error) {
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

function getHeader() {
  if (props.create) {
    return t("Create") + ": " + t(props.name);
  } else {
    return t("Edit") + ": " + t(props.name);
  }
}

const filterValue = ref("");
function _isFiltered(name: string, field: any) {
  if (props.create && field.read_only) {
    return false;
  }
  if (filterValue.value === "") {
    return true;
  }
  return t(props.schema.fields[name].label)
    .toLowerCase()
    .includes(filterValue.value.toLowerCase());
}
// Check if a schema condition is true
function checkCondition(condition: any) {
  if (condition == null) {
    return true;
  }
  let cond = object_temp.value[condition.field] == condition.value;
  return cond;
}
function isFiltered(name: string, field: any) {
  return _isFiltered(name, field) && checkCondition(field.condition);
}
</script>

<template>
  <div>
    <PrimeConfirmDialog></PrimeConfirmDialog>
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
      <div class="mt-5">
        <!-- Editable fields based on input type -->
        <div v-for="(field, name, i) in schema.fields" :key="i">
          <div class="my-4">
            <div v-if="isFiltered(name as string, field) && name != 'id'">
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
                <FieldRichText v-model="object_temp[name]"></FieldRichText>
              </div>

              <div v-else-if="field.input_type === 'image'">
                <div class="pb-2">
                  <input
                    type="file"
                    class=""
                    @change="(event:any) => onUpload(event, name)"
                  />
                  <input
                    v-if="object_temp[name]"
                    type="button"
                    value="Remove image"
                    @click="removeUpload(name)"
                  />
                </div>
                <img
                  :src="
                    pending_uploads[name]
                      ? pending_uploads[name]
                      : object_temp[name]
                  "
                  v-if="object_temp[name] || pending_uploads[name]"
                  alt="Project logo"
                  class="max-w-xs max-h-xs"
                />
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
          <i class="pi pi-filter m-auto" style="font-size: 1.2rem"></i>
          <PrimeInputText
            id="filter"
            v-model="filterValue"
            placeholder="Filter"
            type="text"
            class="flex-grow h-11"
          />
          <div class="flex flex-row flex-wrap gap-3">
            <PrimeButton
              v-if="create"
              :label="t('Create')"
              :loading="isSaving"
              icon="pi pi-check"
              class="p-button-success flex-none"
              @click="createObject()"
            />
            <PrimeButton
              v-else
              :label="t('Save')"
              :loading="isSaving"
              icon="pi pi-check"
              class="flex-none"
              @click="updateObject()"
            />
            <PrimeButton
              :label="t('Cancel')"
              icon="pi pi-times"
              @click="closeModal"
              class="p-button-secondary flex-none"
            />
            <PrimeButton
              :label="t('Delete')"
              v-if="!create && allow_delete"
              icon="pi pi-trash"
              @click="confirmDelete()"
              style="margin-right: 0px"
              class="p-button-danger flex-none"
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
