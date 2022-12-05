<script setup lang="ts">
import { useMembershipStore } from "@/stores/membership";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Listbox from 'primevue/listbox';
import Calendar from 'primevue/calendar';
import { ref, watch, reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import { useToast } from 'primevue/usetoast';

const storeVersion = useSettingsStore();
storeVersion.getVersion();
const membershipStore = useMembershipStore();
membershipStore.getMembershipSchema();
membershipStore.getMembership();
const { t } = useI18n();
const selectedGender = ref();
const birthdate = ref();
const checkboxValue = ref();
const id = ref();
const toast = useToast();
const submitted = ref(false);

const { membership, membershipSchema } = storeToRefs(membershipStore);
watch(membership, (value) => {
  selectedGender.value = { name: value ? value["gender"] : "", code: value ? value["gender"] : "" };
  checkboxValue.value = { name: value ? value["address_is_home"] : "", code: value ? value["address_is_home"] : "" };
  id.value = value ? value["id"] : "";
  if (value) {
    if (typeof value["date_birth"] === 'string') {
      const dateFormat = new Date(value["date_birth"])
      birthdate.value = dateFormat;
    }
    else {
      birthdate.value = value ? value["date_birth"] : "";
    }

  }
})


for (const [key, value] of Object.entries(membershipSchema._object.membershipSchema)) {
  console.log(`${key}: ${value}`);
}

// Working example
// console.log("membership", membershipSchema)
// in console:
// for (const [key, value] of Object.entries(temp0._object.membershipSchema)) {
//   console.log(`${key}: ${value.required}`);
// }

// Vuelidate block
const rules = {
  email: { required, email },
  email_2: { email },
};
const v$ = useVuelidate(rules, membership);


function updateInputText(event: any, key: string | number) {
  //@ts-ignore
  membership.value[key] = event.target.value;
}

function updateRadioGender(event: any, key: string | number) {
  //@ts-ignore
  membership.value[key] = event.target.innerText;
}

function selectBirthdate(event: any, key: string | number) {
  //format date to yyyy-mm-dd ISO 8601 https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  const offset = event.getTimezoneOffset();
  event = new Date(event.getTime() - (offset * 60 * 1000))
  const birthdate = event.toISOString().split('T')[0];

  //@ts-ignore
  membership.value[key] = birthdate;
}

function isInvalid(key: any) {
  if (key === 'email') {
    return v$.value.email.$invalid;
  }
  else if (key === 'email_2') {
    return v$.value.email_2.$invalid;
  }
  else {
    //TODO: give two inputs instead of one
    // like: throw new TypeError("Unknown key for validation", key);
    throw new TypeError("Unknown key for validation");
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
      <div v-for="(value, key) in membershipSchema " :key="value ? key + value.input_type : key" class="field">
        <div v-if="(
        value?.input_type === 'text')">
          <h3>{{
              value?.label
          }}</h3>
          <br />
          <InputText id="user-attr-{{value}}" :type="value?.input_type"
            aria-describedby="user-attr-{{value}}-help"
            @change="updateInputText($event, key)" :value="
            membership ? membership[key] : ''" />
        </div>
        <div v-else-if="value?.input_type === 'radio'">
          <div v-if="value?.label === 'Gender'">
            <h3>{{ value?.label }}</h3>
            <Listbox v-model="selectedGender" :options="schemaToPrime(value.choices)" optionLabel="name"
              placeholder="Select Gender(s)" @click="updateRadioGender($event, key)" />
          </div>
          <div v-else-if="value?.label === 'Address is home'">
            <h3>{{ value?.label }}</h3>
            <Listbox v-model="checkboxValue" :options="schemaToPrime(value.choices)" optionLabel="name"
              placeholder="Select Choice" @click="updateRadioGender($event, key)" />

          </div>
        </div>
        <div v-else-if="value?.input_type === 'email' && membership">
          <div v-if="key === 'email'">
            <!-- TODO: Change five lines below v$.email.$errors in something like v$.{key}.errors or v$.$key.errors-->
            <!-- Should vuelidate start from beginning on or after saving as it is now?  -->
            <h3>{{ value?.label }}</h3>
            <div :class="{ error: v$.email.$errors }">
              <InputText id="user-attr-{{key}}" v-model="membership[key]" :class="{ 'p-invalid': isInvalid(key) && submitted }" />
            </div>
            <div class="input-errors" v-for="error of v$.email.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </div>
          <div v-else-if="key === 'email_2'">
            <h3>{{ value?.label }}</h3>
            <div :class="{ error: v$.email.$errors }">
              <InputText id="user-attr-{{key}}" v-model="membership[key]"
              :class="{ 'p-invalid': isInvalid(key) && submitted }" />
            </div>
            <div class="input-errors" v-for="error of v$.email_2.$errors" :key="error.$uid">
              <div class="p-error">{{ error.$message }}</div>
            </div>

          </div>

        </div>
        <div v-else-if="value?.input_type === 'date'">
          <h3>{{ value?.label }}</h3>
          <Calendar inputId="basic" v-model="birthdate" :showIcon="true" dateFormat="dd.mm.yy"
            @date-select="selectBirthdate($event, key)" />

        </div>
        <div v-else-if="value?.input_type === 'number'">
          <h3>{{ value?.label }}</h3>
          <InputNumber disabled type="number" v-model="id" />
        </div>
        <div v-else>
          <h3>{{ value?.label }}</h3>
          <InputText id="user-attr-{{value}}" :type="value?.input_type" aria-describedby="user-attr-{{value}}-help"
            @change="updateInputText($event, key)" :value="value" :disabled="key === 'id'" />
          Else-Case!!


        </div>
      </div>
      <br />
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

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
