<script setup lang="ts">
import { useMembershipStore } from "@/stores/membership";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import InputMask from "primevue/inputmask";
import Listbox from 'primevue/listbox';
import Calendar from 'primevue/calendar';
import { ref, watch } from 'vue';
import type { Member } from "@/api/types";

const storeVersion = useSettingsStore();
storeVersion.getVersion();
const membershipStore = useMembershipStore();
membershipStore.getMembershipSchema();
membershipStore.getMembership();
const { t } = useI18n();
const selectedGender = ref();

const birthdate = ref();
const inputmask = ref();
const checkboxValue = ref();
const id = ref();

const { membership, membershipSchema } = storeToRefs(membershipStore);
watch(membership, (value, key) => {
  selectedGender.value = { name: value ? value["gender"] : "", code: value ? value["gender"] : "" };
  checkboxValue.value = { name: value ? value["address_is_home"] : "", code: value ? value["address_is_home"] : "" };
  id.value = value? value["id"] : "";
  if (value) {
    if (typeof value["date_birth"] === 'string') {
      console.log("string date", value["date_birth"])
      const dateFormat = new Date(value["date_birth"])
      console.log("dateFormate", dateFormat)
      birthdate.value = dateFormat;
    }
    else {
      birthdate.value = value?value["date_birth"]:"";
    }

  }
})

function updateInputText(event: any, key: string | number) {
    //@ts-ignore
    membership.value[key] = event.target.value;
}

function updateRadioGender(event: any, key: string | number) {
  //@ts-ignore
  membership.value[key] = event.target.innerText;
}

function selectBirthdate(event: any, key: string | number) {
  const offset = event.getTimezoneOffset();
  event = new Date(event.getTime() - (offset * 60 * 1000))
  const birthdate = event.toISOString().split('T')[0];

  //@ts-ignore
  membership.value[key] = birthdate;
}

function save() {
  if (membership.value) {
    membershipStore.updateMembership(membership.value);
  }
}
function schemaToPrime(choices: any) {
  let schema:Array<Object> = [];
  Object.keys(choices).forEach(key => {
  schema.push({name: choices[key], code: choices[key]})
});
  return schema;
}
</script>

<template>
  <div>
    <div v-if="membershipSchema === null && membership === null" class="loading">
      <h2>{{ $t("Loading members") }}</h2>
    </div>
    <div v-else class="members-table">
      <div v-for="(value, key) in membershipSchema " :key="value ? key + value.input_type : key" class="field">
        <div v-if="
        value?.input_type === 'text'">
          <h3>{{
              value?.label
          }}</h3>
          <br />
          <InputText id="user-attr-{{value}}" :type="value?.input_type" aria-describedby="user-attr-{{value}}-help"
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
        <div v-else-if="value?.input_type === 'email'">
          <h3>{{ value?.label }}</h3>
          <InputMask id="user-attr-{{value}}" v-model="inputmask" mask="*@*.a" />
          InputMask for mail address to be done with Vuelidate

        </div>
        <div v-else-if="value?.input_type === 'date'">
          <h3>{{ value?.label }}</h3>
          <Calendar inputId="basic" v-model="birthdate" :showIcon="true" dateFormat="dd.mm.yy"
            @date-select="selectBirthdate($event, key)"/>

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
