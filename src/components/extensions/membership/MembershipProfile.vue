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
import SelectButton from 'primevue/selectbutton';
import { ref, watch } from 'vue';
import type { Members, Member } from "@/api/types";

const storeVersion = useSettingsStore();
storeVersion.getVersion();
const membershipStore = useMembershipStore();
membershipStore.getMembershipSchema();
membershipStore.getMembership();
const { t } = useI18n();
const selectedGender = ref();

const birthdate = ref();
const inputmask = ref();
const options = ref(['Yes', 'No']);
const checkboxVal = ref();

let newData: Member = { first_name: "", last_name: "", email: "", input_type: "" }

const { membership, membershipSchema } = storeToRefs(membershipStore);
watch(membership, (value) => {
  selectedGender.value = { name: value ? value["gender"] : "", code: value ? value["gender"] : "" };
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
  console.log("watch value", value);
})

function updateInputText(event: any, key: string | number) {
  console.log("text event changed", event.target.value, key);
  if (membership)
    //@ts-ignore
    membership.value[key] = event.target.value;


}

function updateRadioGender(event: any, key: string) {
  console.log("radio event changed", event.target.innerText, key);
  console.log("membership.value[key]", membership.value[key]);
  //@ts-ignore
  membership.value[key] = event.target.innerText;

  //idee um auch nach reload das auserwählte Gender zu zeigen aber funktioniert leider nicht...
  // selectedGender.value =  { name: event.target.innerText, code: event.target.innerText }

}

function selectBirthdate(event: any, key: string | number) {
  console.log("calendar event changed", event, key);
  //format Date to ISO 8601 format for Django database
  const offset = event.getTimezoneOffset();

  event = new Date(event.getTime() - (offset * 60 * 1000))
  const birthdate = event.toISOString().split('T')[0];
  console.log(birthdate);

  //@ts-ignore
  membership.value[key] = birthdate;
  console.log("membership.value[key]", membership.value[key]);
}

function typeBirthdate(event: any, key: string | number) {
  console.log("type date", event, key);
}


function updateCheckBox(event: any, key: string) {
  console.log("checkbox event changed", event.target.innerText, key);
  console.log("membership.value[key]", membership.value[key]);

  //@ts-ignore
  membership.value[key] = event.target.innerText;
}

function save() {
  if (membership.value) {
    membershipStore.updateMembership(membership.value);
  }
}
function schemaToPrime(choices: any) {
  console.log("choices", choices)
  // choices.forEach(element => {

  // });
  return [
    { name: 'diverse', code: 'diverse' },
    { name: 'female', code: 'female' },
    { name: 'male', code: 'male' },
  ]
}
</script>

<template>
  <div>
    <div v-if="membershipSchema === null && membership === null" class="loading">
      <h2>{{ $t("Loading members") }}</h2>
    </div>
    <div v-else class="members-table">
      <div v-for="(value, key) in membershipSchema " :key="value ? key + value.input_type : key" class="field">
        <!-- <strong for="user-attr-{{value}}">{{ key }}</strong> -->
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
        <div v-else-if="
        value?.input_type === 'checkbox'">
          <h3>{{ value.label }}</h3>
          <SelectButton v-model="checkboxVal" :options="options" aria-labelledby="single"
            @click="updateCheckBox($event, key)" />
          preset status in Django als Übergabe?
        </div>
        <div v-else-if="value?.input_type === 'radio'">
          <h3>{{ value?.label }}</h3>
          <Listbox v-model="selectedGender" :options="schemaToPrime(value.choices)" optionLabel="name"
            placeholder="Select Gender(s)" @click="updateRadioGender($event, key)" />

          preset status in Django als Übergabe?
        </div>
        <div v-else-if="value?.input_type === 'email'">
          <h3>{{ value?.label }}</h3>
          <InputMask id="user-attr-{{value}}" v-model="inputmask" mask="*@*.a" />
          InputMask for mail address to be done with Vuelidate

        </div>
        <div v-else-if="value?.input_type === 'date'">
          <h3>{{ value?.label }}</h3>
          <Calendar inputId="basic" v-model="birthdate" :showIcon="true" dateFormat="dd.mm.yy"
            @date-select="selectBirthdate($event, key)" @input="typeBirthdate($event, key)"/>

        </div>
        <div v-else-if="value?.input_type === 'number'">
          <h3>{{ value?.label }}</h3>
          <!-- bad hardcoding but how to assign membership.id if not possible in <script>?-->
          <InputNumber disabled type="number" v-model="newData[key]" />
          <!--{{value1 = membership[key]}}-->
          <!--<InputNumber v-model="value1"-->
          <!--how to implement disabled input field, when no if case is possible inside else-if-case?-->
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
