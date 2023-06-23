<script setup lang="ts">
import type { Schema } from "@/api/types";
import { checkCondition } from "@/helpers/schema";
import { useMainStore } from "@/stores/main";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import { storeToRefs, type StoreGeneric } from "pinia";
import PrimeDropdown from "primevue/dropdown";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { PropType } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
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

// Load membership type
const route = useRoute();
const error = ref<any>(null);
const mainStore = useMainStore();
const { membershipsTypes } = storeToRefs(mainStore);
mainStore.get("membershipsTypes", Number(route.params.id)).catch((e: any) => {
  error.value = e;
});

// Validation -----------------------------------------------------------------

const rules: any = {};
for (var field_name in props.schema.fields) {
  const schemaField = props.schema.fields[field_name];
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
  validate,
  object_temp,
});
</script>

<template>
  Membership type: {{ membershipsTypes.detail }}
  <!-- Structure given in schema -->
  <div class="mt-5">
    STATUS SHOULD ONLY BE THAT OF MEMBERSHIP TYPE
    <PrimeDropdown
      v-model="object_temp['status']"
      :options="[{ label: 'custom' }]"
      :optionLabel="(option:any) => t(option.label)"
      optionValue="value"
      :filter="true"
      :placeholder="t('Select a choice')"
      :showClear="true"
      class="w-full"
      :class="{ 'p-invalid': isInvalid }"
    />
    <!-- <ObjectField
      :name="'status'"
      :field="schema.fields['status']"
      v-model="object_temp['status']"
      :isInvalid="isInvalid('status')"
      :disabled="
        checkCondition(object_temp, schema.fields['status'].read_only) &&
        !create
      "
      :returnErrorMessage="fieldError('status')"
    /> -->
  </div>
</template>

<style scoped>
label {
  font-weight: bold;
}
</style>
