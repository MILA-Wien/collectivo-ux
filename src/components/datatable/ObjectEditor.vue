<script setup lang="ts">
import type { Schema } from "@/api/types";
import { checkCondition } from "@/helpers/schema";
import { errorToast, successToast } from "@/helpers/toasts";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required, requiredIf } from "@vuelidate/validators";
import { electronicFormatIBAN, isValidIBAN } from "ibantools";
import type { StoreGeneric } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { PropType } from "vue";
import { ref, toRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import ObjectField from "./ObjectField.vue";
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
const object_temp = ref<any>({});
if (props.object != undefined) {
  object_temp.value = JSON.parse(JSON.stringify(props.object));
}
const schema = toRef(props, "schema");
const isSaving = ref(false);

// Simple safe calculator
// https://stackoverflow.com/questions/40433498/
function calculate(expression: string) {
  try {
    ("strict mode");
    var allowedChars = "1234567890%^*()-+/. ";
    for (var i = 0; i < expression.length; i++)
      if (allowedChars.indexOf(expression.charAt(i)) < 0) {
        return undefined;
      }
    return eval(expression);
  } catch (e) {
    return undefined;
  }
}

const replace = (string: String, object: any) =>
  // @ts-ignore (typescript does not now this method)
  string.replaceAll(/\{([^}]+)\}/gi, (_: any, a: any) => object[a]);

// Fill out fixed and default values
for (const [key, value] of Object.entries(schema.value.fields)) {
  if (value.value != undefined) {
    object_temp.value[key] = value.value;
  } else if (
    value.default != undefined &&
    object_temp.value[key] == undefined
  ) {
    object_temp.value[key] = value.default;
  }
}

for (const [key, value] of Object.entries(schema.value.fields)) {
  if (value.calculate) {
    watch(
      () => calculate(replace(value.calculate!, object_temp.value)),
      (newValue) => (object_temp.value[key] = newValue)
    );
  }
}

// Format data ----------------------------------------------------------------

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
    if (object_temp.value[key] != undefined && object_temp.value[key] != null) {
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
async function deleteObjectConfirmed() {
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
const deleteObject = () => {
  confirm.require({
    message: "Are you sure you want to delete this object?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      deleteObjectConfirmed();
    },
  });
};

// Validation -----------------------------------------------------------------
const europeanIBAN = [
  "AD", "AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GI", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "MT", "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK",
]
const validators: { [key: string]: any } = {
  iban: (param: boolean) =>
    helpers.withMessage("Invalid IBAN or IBAN is not valid for SEPA.", (value: any) => {
      if (param) {
        const iban = electronicFormatIBAN(value);
        if (iban && europeanIBAN.includes(iban.substring(0, 2))) {
          return isValidIBAN(iban || "");
        }
        return false;
      } else {
        return false;
      }
    }),
  min: (param: number) =>
    helpers.withMessage("Value is too small", (value: any) => {
      if (param == undefined) {
        return true;
      }
      if (typeof param == "string") {
        // Get value from other field
        param = object_temp.value[param];
      }
      return value >= param;
    }),
  max: (param: number) =>
    helpers.withMessage("Value is too large", (value: any) => {
      if (param == undefined) {
        return true;
      }
      if (typeof param == "string") {
        // Get value from other field
        param = object_temp.value[param];
      }
      return value <= param;
    }),
};

const rules: any = {};
for (var field_name in props.schema.fields) {
  const schemaField = schema.value.fields[field_name];
  if (schemaField.required) {
    if (schemaField.visible == null) {
      rules[field_name] = { required };
    } else {
      // Required only if field is visible
      rules[field_name] = {
        requiredIfCondition: requiredIf(() => {
          return checkCondition(object_temp.value, schemaField.visible);
        }),
      };
    }
    if (schemaField.validators) {
      for (const validator in schemaField.validators) {
        if (validators[validator]) {
          rules[field_name][validator] = validators[validator](
            schemaField.validators[validator]
          );
        }
      }
    }
  }
}

const v$ = useVuelidate(rules, object_temp.value);
v$.value.$validate();

function fieldError(key: any) {
  if (v$.value[key]?.$errors.length == 0) {
    return false;
  }
  const err = v$.value[key]?.$errors[0].$message;
  if (typeof err === "string") {
    return t(err);
  }
  return false;
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

defineExpose({
  createObject,
  updateObject,
  deleteObject,
  createSubmitData,
  validate,
  object_temp,
});
</script>

<template>
  <!-- Case 1: Structure is given in schema -->
  <div class="mt-5" v-if="schema.structure">
    <div v-for="(section, i) in schema.structure" :key="i" class="">
      <div v-if="checkCondition(object_temp, section.visible)">
        <div v-if="section.hr">
          <hr class="my-2" />
        </div>
        <div v-if="section.label">
          <h3 class="mb-0 pb-1">{{ t(section.label) }}</h3>
        </div>
        <div v-if="section.description">
          {{ t(section.description) }}
        </div>
        <div v-if="section.label || section.description" class="pb-4"></div>

        <!-- Read only section -->
        <div v-if="section.style == 'read_only'">
          <div v-for="(field, j) in section.fields" class="pb-1" :key="j">
            <span class="font-bold">{{ t(schema.fields[field].label) }}: </span>
            <span v-if="schema.fields[field].input_type == 'select'">
              {{ schema.fields[field].choices![object_temp[field]] }}
            </span>
            <span v-else>{{ t(object_temp[field]) }}</span>
          </div>
        </div>

        <!-- Cokumn section -->
        <div v-else-if="section.style == 'col'">
          <div v-for="(field, j) in section.fields" class="pb-4" :key="j">
            <ObjectField :name="field" :field="schema.fields[field]" v-model="object_temp[field]"
              :isInvalid="isInvalid(field)" :disabled="checkCondition(object_temp, schema.fields[field].read_only) &&
                !create
                " :returnErrorMessage="fieldError(field)" />
          </div>
        </div>

        <!-- Flex row section (default) -->
        <div v-else class="flex flex-row flex-wrap gap-x-5">
          <div v-for="(field, j) in section.fields" class="flex-auto w-72 pb-4" :key="j">
            <ObjectField :name="field" :field="schema.fields[field]" v-model="object_temp[field]"
              :isInvalid="isInvalid(field)" :disabled="checkCondition(object_temp, schema.fields[field]?.read_only) &&
                !create
                " :returnErrorMessage="fieldError(field)" v-if="schema.fields[field]" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Case 2: No structure is given in schema -->
  <div class="mt-5" v-else>
    <div v-for="(field, name, i) in schema.fields" :key="i">
      <div class="my-4">
        <div v-if="name != 'id' &&
          checkCondition(object_temp, field.visible) &&
          !(checkCondition(object_temp, field.read_only) && create)
          ">
          <ObjectField :name="name" :field="field" v-model="object_temp[name]" :isInvalid="isInvalid(name)"
            :disabled="checkCondition(object_temp, field.read_only) && !create" :returnErrorMessage="fieldError(name)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
label {
  font-weight: bold;
}
</style>
