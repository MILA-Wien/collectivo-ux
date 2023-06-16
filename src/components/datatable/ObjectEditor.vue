<script setup lang="ts">
import type { Schema } from "@/api/types";
import { checkCondition } from "@/helpers/schema";
import { errorToast, successToast } from "@/helpers/toasts";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
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
  id: {
    validator: (prop) =>
      typeof prop === "number" || typeof prop === "string" || prop === null,
    required: false,
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

// Modal state ----------------------------------------------------------------
const isVisible = ref(true);
const isSaving = ref(false);

function getHeader() {
  if (props.create) {
    return t("Create") + ": " + t(props.schema.label);
  } else {
    var header = t("Edit") + ": " + t(props.schema.label);
    if (object_temp.value.id) {
      header = header + " #" + object_temp.value.id;
    }
    return header;
  }
}

function closeModal() {
  emit("close");
}

// Format data ----------------------------------------------------------------
const pending_uploads = ref<any>({});
function prepareUpload(event: any, name: any) {
  const file = event.target.files[0];
  pending_uploads.value[name] = URL.createObjectURL(file);
  object_temp.value[name] = file;
}
function removeUpload(name: any) {
  if (pending_uploads[name] != undefined) {
    pending_uploads.value[name] = null;
  }
  object_temp.value[name] = "";
}

function formatDate(value: Date): string {
  // See https://stackoverflow.com/a/69399448/14396787
  var timestamp = value.getTime() - value.getTimezoneOffset() * 60000;
  var correctDate = new Date(timestamp);
  return correctDate.toISOString().split("T")[0];
}

function createSubmitData() {
  for (const [key, value] of Object.entries(object_temp.value)) {
    if (value instanceof Date) {
      object_temp.value[key] = formatDate(value);
    }
  }

  // Generate form data (needed for files)
  let submitData = new FormData();
  for (const key of Object.keys(object_temp.value)) {
    if (
      object_temp.value[key] !== undefined &&
      object_temp.value[key] !== null
    ) {
      // Field is image
      if (props.schema.fields[key].input_type == "image") {
        // Submit image only if changed or removed
        if (object_temp.value[key] instanceof File) {
          submitData.append(key, object_temp.value[key]);
        } else if (object_temp.value[key] == "") {
          submitData.append(key, object_temp.value[key]);
        }
      }
      // Field is array
      // See https://stackoverflow.com/questions/60754544/
      else if (Array.isArray(object_temp.value[key])) {
        for (const item of object_temp.value[key]) {
          submitData.append(key, item);
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

// CRUD commands --------------------------------------------------------------
async function createObject() {
  isSaving.value = true;
  if (!(await validate())) {
    isSaving.value = false;
    return;
  }
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
  if (!(await validate())) {
    isSaving.value = false;
    return;
  }
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

// Validation -----------------------------------------------------------------

const rules: any = {};
for (var key in props.schema.fields) {
  const schemaField = props.schema.fields[key];
  if (schemaField.required) {
    if (schemaField.visible == null) {
      rules[key] = { required };
    } else {
      // Required only if field is visible
      rules[key] = {
        requiredIfCondition: requiredIf(() => {
          return checkCondition(object_temp.value, schemaField.visible);
        }),
      };
    }
  }
}

const v$ = useVuelidate(rules, object_temp.value);

function returnErrorMessage(key: any) {
  if (Object.keys(rules).includes(key)) {
    if (v$.value[key].requiredIfCondition) {
      return t(v$.value[key].requiredIfCondition.$message || "");
    }
    return t(v$.value[key].required?.$message || "");
  } else {
    return false;
  }
}

function isInvalid(key: any) {
  if (Object.keys(rules).includes(key)) {
    return v$.value[key].$invalid || v$.value[key].$pending.$response;
  } else {
    return false;
  }
}

async function validate() {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    console.log(v$.value.$errors);
    for (let err of v$.value.$errors) {
      toast.add({
        severity: "error",
        summary: t("Error"),
        detail:
          (typeof err.$property === "string" ? t(err.$property) : "") +
          ": " +
          (typeof err.$message === "string" ? t(err.$message) : ""),
        life: 5000,
      });
    }
  }
  return isFormCorrect;
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
            <div
              v-if="
                name != 'id' &&
                checkCondition(object_temp, field.visible) &&
                !(checkCondition(object_temp, field.read_only) && create)
              "
            >
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
                  :class="{ 'p-invalid': isInvalid(name) }"
                  :disabled="checkCondition(object_temp, field.read_only)"
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
                  :class="{ 'p-invalid': isInvalid(name) }"
                  class="w-full"
                  :disabled="checkCondition(object_temp, field.read_only)"
                />
              </div>

              <div
                v-else-if="field.input_type === 'checkbox'"
                class="flex flex-row"
              >
                <PrimeInputSwitch
                  v-model="object_temp[name]"
                  :disabled="checkCondition(object_temp, field.read_only)"
                  :class="{ 'p-invalid': isInvalid(name) }"
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
                  dateFormat="yy-mm-dd"
                  :disabled="checkCondition(object_temp, field.read_only)"
                  :class="{ 'p-invalid': isInvalid(name) }"
                />
              </div>

              <div v-else-if="field.input_type === 'textarea'">
                <PrimeTextarea
                  v-model="object_temp[name]"
                  :disabled="checkCondition(object_temp, field.read_only)"
                  :class="{ 'p-invalid': isInvalid(name) }"
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
                    @change="(event:any) => prepareUpload(event, name)"
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
                  :placeholder="field.write_only ? '********' : ''"
                  :disabled="checkCondition(object_temp, field.read_only)"
                  :class="{ 'p-invalid': isInvalid(name) }"
                  class="w-full"
                />
              </div>
              <div>
                <small v-if="isInvalid(name)" class="p-error">{{
                  returnErrorMessage(name)
                }}</small>
              </div>
              <div>
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
      </div>

      <!-- Footer -->
      <template #footer>
        <div
          class="object-detail-filter flex flex-row flex-wrap mt-5 items-center gap-3"
        >
          <div class="flex-grow"></div>
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
