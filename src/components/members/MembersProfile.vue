<script setup lang="ts">
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import InputText from "primevue/inputtext";
import { ref, watch, toRef } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import RadioButton from "primevue/radiobutton";
import PrimeButton from "primevue/button";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { t } = useI18n();
const toast = useToast();
const submitted = ref(false);
const membersStore = useMembersStore();

// Set page title
const menuStore = useMenuStore();
menuStore.setTitle("Membership");

// Get membership data and schema from store
const props = defineProps({
  membership: { type: Object, required: true },
  membershipSchema: { type: Object, required: true },
});
const membership = toRef(props, "membership");
const membershipSchema = toRef(props, "membershipSchema");

// Reference for selected gender radio button
const selectedGender = ref();
selectedGender.value = membership.value["gender"];
watch(membership.value, (value) => {
  selectedGender.value = value ? value["gender"] : "";
});

// Open keycloak account page
async function openKeycloakAccount() {
  const accountUrl = await user.value?.accountUrl;
  window.open(accountUrl, "_blank");
}

// Check if a schema condition is true
function checkCondition(condition: any) {
  if (condition == null) {
    return true;
  }
  let cond = membership.value[condition.field] == condition.value;
  return cond;
}

// Set validation rules
const rules: any = {};
for (var key in membershipSchema.value) {
  const schemaField = membershipSchema.value[key];
  if (schemaField.required) {
    if (schemaField.condition == null) {
      rules[key] = { required };
    } else {
      // Required only if field is visible
      rules[key] = {
        requiredIfCondition: requiredIf(() => {
          return checkCondition(schemaField.condition);
        }),
      };
    }
  }
}
const v$ = useVuelidate(rules, membership.value);

function updateInputText(event: any, key: string | number) {
  if (membership.value) {
    membership.value[key as keyof typeof membership.value] = event.target.value;
  }
}

function updateRadioButton(label: any, key: string) {
  if (membership.value) {
    membership.value[key as keyof typeof membership.value] = label;
  }
}

function capitalized(name: string) {
  const capitalizedFirst = name[0].toUpperCase();
  const rest = name.slice(1);
  return capitalizedFirst + rest;
}

function convertDate(value: string) {
  //convert date to german format from https://stackoverflow.com/a/2086843/19932351
  let datePart = value.match(/\d+/g);
  if (datePart) {
    let year = datePart[0].substring(2);
    let month = datePart[1];
    let day = datePart[2];
    return day + "." + month + "." + year;
  }
}

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
    return (
      (v$.value[key].$invalid && submitted) || v$.value[key].$pending.$response
    );
  } else {
    return false;
  }
}

async function save() {
  submitted.value = true;
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail:
        typeof v$.value.$errors[0].$message === "string"
          ? t(v$.value.$errors[0].$message)
          : "",
      life: 5000,
    });
    return;
  } else if (membership.value) {
    try {
      await membersStore.updateMembersProfile(membership.value);
      toast.add({
        severity: "success",
        summary: t("Profile updated"),
        life: 5000,
      });
    } catch (e: any) {
      toast.add({
        severity: "error",
        summary: t("Update failed"),
        detail: `Request-id: "${e?.response?.headers["x-request-id"]}" `,
      });
    }
  } else {
    throw new TypeError("Membership value is empty");
  }
}

function schemaToPrime(choices: any) {
  let schema: Array<Object> = [];
  Object.keys(choices).forEach((key) => {
    schema.push({ name: choices[key], code: choices[key] });
  });
  return schema;
}
</script>

<template>
  <div>
    <Toast />
    <div
      v-if="membershipSchema === null && membership === null"
      class="loading"
    >
      <h2>{{ $t("Loading members") }}</h2>
    </div>
    <div v-else class="members-table">
      <div
        v-for="(value, key) in membershipSchema"
        :key="value ? key + value.input_type : key"
      >
        <div v-if="checkCondition(value.condition)" class="field">
          <div v-if="value.read_only">
            <h3>{{ t(value?.label) }}</h3>
            <div v-if="value.input_type === 'date'">
              <InputText
                disabled
                :value="membership ? membership[key as keyof typeof membership] ? convertDate(membership[key as keyof typeof membership] as string) : '' : ''"
              />
            </div>
            <div v-else-if="value?.input_type === 'email'">
              <InputText
                disabled
                :value="membership ? membership[key as keyof typeof membership] : ''"
              />
              <div class="changeMailButton">
                <PrimeButton
                  :label="t('Change mail or password')"
                  icon="pi pi-envelope"
                  @click="openKeycloakAccount()"
                  autofocus
                />
              </div>
            </div>

            <!-- Disabled choice fields (translated) -->
            <div v-else-if="value?.choices != null">
              <InputText
                disabled
                :value="t(membership[key] ? membership[key] : '')"
              />
            </div>

            <!-- Other disabled fields -->
            <div v-else>
              <InputText
                disabled
                :value="membership ? membership[key as keyof typeof membership] : ''"
              />
            </div>
          </div>
          <div v-else>
            <div v-if="value?.input_type === 'text'">
              <h3 v-if="value.required">{{ t(value?.label) }}*</h3>
              <h3 v-else>{{ t(value?.label) }}</h3>
              <InputText
                id="user-attr-{{value}}"
                :type="value?.input_type"
                aria-describedby="user-attr-{{value}}-help"
                @change="updateInputText($event, key)"
                :value="membership ? membership[key as keyof typeof membership] : ''"
                :class="{ 'p-invalid': isInvalid(key) }"
              />
              <br />
              <span v-if="isInvalid(key)" class="p-error">{{
                returnErrorMessage(key)
              }}</span>
            </div>
            <div v-else-if="value?.input_type === 'radio'">
              <div v-if="key === 'gender'" class="w-56">
                <h3 v-if="value.required">{{ t(value?.label) }}*</h3>
                <h3 v-else>{{ t(value?.label) }}</h3>
                <br />
                <div
                  v-for="category of (schemaToPrime(value.choices) as any)"
                  class="field-radiobutton"
                  :key="category.name"
                >
                  <RadioButton
                    :inputId="category.name"
                    name="key"
                    :value="category.name"
                    v-model="selectedGender"
                    @click="updateRadioButton(category.name, key)"
                  />
                  <label :for="category.name" class="genderLabel">{{
                    t(capitalized(category.name))
                  }}</label>
                </div>
                <span v-if="isInvalid(key)" class="p-error">{{
                  returnErrorMessage(key)
                }}</span>
              </div>
            </div>
          </div>
          <br />
        </div>
      </div>
      <PrimeButton
        :label="t('Save')"
        icon="pi pi-check"
        @click="save()"
        autofocus
      />
    </div>
  </div>
</template>

<style>
.genderLabel {
  padding-left: 10px;
}
.changeMailButton {
  padding-top: 10px;
}
</style>
