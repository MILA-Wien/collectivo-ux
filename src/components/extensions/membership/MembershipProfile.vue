<script setup lang="ts">
import { useMembershipStore } from "@/stores/membership";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import InputText from "primevue/inputtext";
import Listbox from 'primevue/listbox';
import Calendar from 'primevue/calendar';
import { ref, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast';

const membershipStore = useMembershipStore();
membershipStore.getMembershipSchema();
membershipStore.getMembership();
const { t } = useI18n();
const selectedGender = ref();
const toast = useToast();
const submitted = ref(false);
const { membership, membershipSchema } = storeToRefs(membershipStore);

watch(membership, (value) => {
  selectedGender.value = { name: value ? value["gender"] ? value["gender"] : "" : "", code: value ? value["gender"] : "" };
})

// Vuelidate block
// Required fields need to be added manually and will be checked afterwards, if each field is contained in membershipSchema
const rules: any = {
  gender: { required },
  address_street: { required },
  address_number: { required },
  address_postcode: { required },
  address_city: { required },
  address_country: { required },
};
const v$ = useVuelidate(rules, membership);
watch(membershipSchema, (value) => {
  const dict: Array<Array<string | any>> = Object.entries(JSON.parse(JSON.stringify(membershipSchema.value)));
  for (let i = 0; i < dict.length; i++) {
    if (dict[i][1].required) {
      if (!Object.keys(rules).includes(dict[i][0])) {
        throw TypeError("Missing required field in rules");
      }
    }
  }
})


function updateInputText(event: any, key: string | number) {
  if (membership.value) {
    membership.value[key as keyof typeof membership.value] = event.target.value;
  }
}

function updateRadioGender(event: any, key: string | number) {
  if (membership.value) {
    membership.value[key as keyof typeof membership.value] = event.target.innerText;
  }
}

function convertDate(value: string) {
  //convert date to german format from https://stackoverflow.com/a/2086843/19932351
  let datePart = value.match(/\d+/g);
  if (datePart) {
    let year = datePart[0].substring(2);
    let month = datePart[1];
    let day = datePart[2];
    return day + '.' + month + '.' + year;
  }
}

function returnErrorMessage(key: any) {
  if (Object.keys(rules).includes(key)) {
    return v$.value[key].required.$message;
  }
  else {
    return false;
  }
}

function isInvalid(key: any) {
  if (Object.keys(rules).includes(key)) {
    return (v$.value[key].$invalid && submitted) || v$.value[key].$pending.$response;
  }
  else {
    return false;
  }
}

async function save() {
  submitted.value = true;
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    toast.add({ severity: 'error', summary: t('Error'), detail: v$.value.$errors[0].$message, life: 5000 });
    return;
  }
  else if (membership.value) {
    membershipStore.updateMembership(membership.value);
  }
  else {
    throw new TypeError("Membership value is empty");
  }
}
function schemaToPrime(choices: any) {
  let schema: Array<Object> = [];
  Object.keys(choices).forEach(key => {
    schema.push({ name: choices[key], code: choices[key] })
  });
  return schema;
}
</script>

<template>
  <div>
    <Toast />
    <div v-if="membershipSchema === null && membership === null" class="loading">
      <h2>{{ $t("Loading members") }}</h2>
    </div>
    <div v-else class="members-table">
      <div v-for="(value, key) in membershipSchema" :key="value ? key + value.input_type : key" class="field">
        <div v-if="value.read_only">
          <h3>{{ value?.label }}</h3>
          <div v-if="value.input_type === 'date'">
            <InputText disabled
              :value="membership ? convertDate(membership[key as keyof typeof membership] as string) : ''" />
          </div>
          <div v-else>
            <InputText disabled :value="membership ? membership[key as keyof typeof membership] : ''" />
          </div>
        </div>
        <div v-else>
          <div v-if="(value?.input_type === 'text' || value?.input_type === 'email')">
            <h3 v-if="value.required">{{ value?.label }}*</h3>
            <h3 v-else>{{ value?.label }}</h3>

            <InputText id="user-attr-{{value}}" :type="value?.input_type" aria-describedby="user-attr-{{value}}-help"
              @change="updateInputText($event, key)"
              :value="membership ? membership[key as keyof typeof membership] : ''"
              :class="{ 'p-invalid': isInvalid(key) }" />
            <br />
            <span v-if="isInvalid(key)" class="p-error">{{ returnErrorMessage(key) }}</span>
          </div>
          <div v-else-if="value?.input_type === 'radio'">
            <div v-if="key === 'gender'">
              <h3 v-if="value.required">{{ value?.label }}*</h3>
              <h3 v-else>{{ value?.label }}</h3>
              <Listbox v-model="selectedGender" :options="schemaToPrime(value.choices)" optionLabel="name"
                placeholder="Select Gender(s)" @click="updateRadioGender($event, key)" />
              <br />
              <span v-if="isInvalid(key)" class="p-error">{{ returnErrorMessage(key) }}</span>
            </div>
          </div>
          <div v-else>
            <h3>{{ value?.label }} Else-Case!!</h3>
            <InputText id="user-attr-{{value}}" :type="value?.input_type" aria-describedby="user-attr-{{value}}-help"
              :value="value" :disabled="key === 'id'" />
          </div>
        </div>
        <br />
      </div>
      <ButtonPrime :label="t('Save')" icon="pi pi-check" @click="save()" autofocus />

    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.required {
  color: red;
}


@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
