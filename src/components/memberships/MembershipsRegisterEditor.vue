<!-- Special editor for membership registration that depends on the details of the respective membership type. -->
<script setup lang="ts">
import type { Schema } from "@/api/types";
import { checkCondition } from "@/helpers/schema";
import { useMainStore } from "@/stores/main";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import { storeToRefs, type StoreGeneric } from "pinia";
import PrimeDropdown from "primevue/dropdown";
import PrimeInputNumber from "primevue/inputnumber";
import { useToast } from "primevue/usetoast";
import type { PropType } from "vue";
import { ref, toRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();
defineEmits(["change", "close"]);

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

// Load membership type
const route = useRoute();
const mainStore = useMainStore();
const { membershipsTypes } = storeToRefs(mainStore);
object_temp.value.type = route.params.id;

// Validation -----------------------------------------------------------------

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
  }
}
if (membershipsTypes.value.detail.has_shares) {
  rules.shares_signed = { required };
}

const v$ = useVuelidate(rules, object_temp.value);
v$.value.$validate();

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

function getStatusOptionsForMembershipType() {
  const options: any[] = [];
  if (props.schema.fields["status"]?.choices) {
    for (const status of membershipsTypes.value.detail.statuses) {
      let i = 0;
      const x = props.schema.fields["status"].choices[status];
      options.push({
        label: x,
        value: status,
        key: ++i,
      });
    }
  }
  return options;
}
</script>

<template>
  <!-- Structure given in schema -->
  <div class="mt-5" v-if="membershipsTypes.detailLoaded">
    <div class="my-4">
      <span class="font-bold">{{ t("Type of membership") }}: </span>
      <PrimeDropdown
        v-model="object_temp['status']"
        :options="getStatusOptionsForMembershipType()"
        :optionLabel="(option:any) => t(option.label)"
        optionValue="value"
        :filter="true"
        :placeholder="t('Select a choice')"
        :showClear="true"
        class="w-full"
        :class="{ 'p-invalid': isInvalid('status') }"
      />
    </div>
    <div class="my-4" v-if="membershipsTypes.detail.has_shares">
      <span class="font-bold">{{ t("Number of shares") }}: </span>
      <PrimeInputNumber
        v-model="object_temp['shares_signed']"
        optionValue="value"
        showButtons
        class="w-full"
        :class="{ 'p-invalid': isInvalid('shares_signed') }"
      />
    </div>
  </div>
</template>

<style scoped>
label {
  font-weight: bold;
}
</style>
