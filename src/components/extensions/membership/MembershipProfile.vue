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
const birthday = ref();
const person_type = ref();
const shares_payment_type = ref();
const membership_type = ref();
const id = ref();
const shares_number = ref();
const toast = useToast();
const submitted = ref(false);
const membership_start = ref();
let rules = {};

const { membership, membershipSchema } = storeToRefs(membershipStore);
watch(membership, (value) => {
  selectedGender.value = { name: value ? value["gender"] ? value["gender"] : "" : "", code: value ? value["gender"] : "" };
  id.value = value ? value["id"] : "";
  shares_number.value = value ? value["shares_number"] : "";
})


// Hier wird das required direkt übersetzt und nicht als Objekt genommen. Es kommt immer  { "required": { "$message": "Value is required", "$params": { "type": "required" } } },
watch(membershipSchema, (value) => {
  console.log("membership", membershipSchema)
  for(let i = 0; i < Object.entries(JSON.parse(JSON.stringify(membershipSchema.value))).length; i++){
    if(Object.entries(JSON.parse(JSON.stringify(membershipSchema.value)))[i][1].required){
      console.log("enter",i)
      console.log(Object.entries(JSON.parse(JSON.stringify(membershipSchema.value)))[i][0])
      rules[Object.entries(JSON.parse(JSON.stringify(membershipSchema.value)))[i][0].toString()]={required}
    }
  }
})
  // Hier kann ich anscheinend nur eine Zeile schreiben ohne einen Error zu werfen + if-statement wirft Error im Vorhinein
  // Object.entries(JSON.parse(JSON.stringify(membershipSchema.value))).forEach(
  //   (item: any) =>
  //   // console.log( item[0], "required:", item[1].required, "read_only: ", item[1].read_only, item[1].help_text)
  // )


// Vuelidate block
const v$ = useVuelidate(rules, membership);


function updateInputText(event: any, key: string | number) {
  //@ts-ignore
  membership.value[key] = event.target.value;
}

function updateRadioGender(event: any, key: string | number) {
  //@ts-ignore
  membership.value[key] = event.target.innerText;
}

function selectDate(event: any, key: string | number) {
  //format date to yyyy-mm-dd ISO 8601 https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  const offset = event.getTimezoneOffset();
  event = new Date(event.getTime() - (offset * 60 * 1000))
  const birthday = event.toISOString().split('T')[0];

  //@ts-ignore
  membership.value[key] = birthday;
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
    {{ membership }}
    {{rules}}

    <div v-if="membershipSchema === null && membership === null" class="loading">
      <h2>{{ $t("Loading members") }}</h2>
    </div>
    <div v-else class="members-table">
      <div v-for="(value, key) in membershipSchema" :key="value ? key + value.input_type : key" class="field">
        <div v-if="value.read_only">
          <h3>{{value?.label}}</h3>
          <span class="required" v-if="value.required">*</span>
          <InputText disabled :value="membership ? membership[key] : ''"/>
        </div>
        <div v-else>
          <div v-if="(value?.input_type === 'text' || value?.input_type === 'email')">
            <h3 v-if="value.required">{{value?.label}}*</h3>
            <h3 v-else>{{value?.label}}</h3>

            <InputText id="user-attr-{{value}}" :type="value?.input_type" aria-describedby="user-attr-{{value}}-help"
              @change="updateInputText($event, key)" :value="membership ? membership[key] : ''" />
          </div>
          <div v-else-if="value?.input_type === 'radio'">
            <div v-if="key === 'gender'">
              <h3>{{ value?.label }}</h3>
              <Listbox v-model="selectedGender" :options="schemaToPrime(value.choices)" optionLabel="name"
                placeholder="Select Gender(s)" @click="updateRadioGender($event, key)" />
            </div>
          </div>
          <div v-else-if="value?.input_type === 'date'">
            <div v-if="key === 'birthday'">
              <h3>{{ value?.label }}</h3>
              <Calendar inputId="basic" :v-model="birthday" :showIcon="true"
                dateFormat="dd.mm.yy" @date-select="selectDate($event, key)" />
            </div>
            <div v-else-if="key === 'membership_start'">
              <h3>{{ value?.label }}</h3>
              <Calendar inputId="basic" :v-model="membership_start" :showIcon="true"
                dateFormat="dd.mm.yy" @date-select="selectDate($event, key)" />
            </div>
          </div>
          <div v-else>
            <h3>{{ value?.label }}</h3>
            <InputText id="user-attr-{{value}}" :type="value?.input_type" aria-describedby="user-attr-{{value}}-help"
              @change="updateInputText($event, key)" :value="value" :disabled="key === 'id'" />
            Else-Case!!


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
