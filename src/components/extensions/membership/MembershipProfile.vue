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
import { ref } from 'vue';

const storeVersion = useSettingsStore();
storeVersion.getVersion();
const membershipStore = useMembershipStore();
membershipStore.getMembershipSchema();
membershipStore.getMembership();
const { t } = useI18n();
const selectedGender = ref( { name: 'diverse', code: 'diverse' });
const gender = ref([
  { name: 'diverse', code: 'diverse' },
  { name: 'female', code: 'female' },
  { name: 'male', code: 'male' },
]);
const date1 = ref();
const inputmask = ref();
const value1 = ref(42);
const options = ref(['Yes', 'No']);
const checkboxVal = ref('No');

const { membership, membershipSchema } = storeToRefs(membershipStore);

function updateInputText(event: any, key: string) {
  console.log("text event changed", event.target.value, key)
  if (membership)
    //@ts-ignore
    membership.value[key] = event.target.value;


}

function updateCheckBox(event: any, key: string) {
  console.log("checkbox event changed", event.value, key)
  //@ts-ignore
  membership.value[key] = event.value

}

function save() {
  if (membership.value) {
    membershipStore.updateMembership(membership.value);
  }
}
</script>

<template>
  <div>
    <div v-if="membershipSchema === null && membership === null" class="loading">
      <h2>{{ $t("Loading members") }}</h2>
    </div>
    <div v-else class="members-table">
      <div v-for="(value, key) in membershipSchema " :key="value ? key + value : key" class="field">
        <!-- <strong for="user-attr-{{value}}">{{ key }}</strong> -->
        <div v-if="value?.input_type === 'text'">
          <h3>{{ value?.label }}</h3>
          <br />
          <InputText id="user-attr-{{value}}" :type="value?.input_type" aria-describedby="user-attr-{{value}}-help"
            @change="updateInputText($event, key)" :value="membership[key]" />
        </div>
        <div v-else-if="value?.input_type === 'checkbox'">
          <h3>{{ value?.label }}</h3>
          <SelectButton v-model="checkboxVal" :options="options" aria-labelledby="single" @change="updateCheckBox($event, key)"/>
          preset status in Django als Übergabe?
        </div>
        <div v-else-if="value?.input_type === 'select'">
          <h3>{{ value?.label }}</h3>
          <Listbox v-model="selectedGender" :options="gender" optionLabel="name" placeholder="Select Gender(s)" />

          preset status in Django als Übergabe?
        </div>
        <div v-else-if="value?.input_type === 'email'">
          <h3>{{ value?.label }}</h3>
          <InputMask id="user-attr-{{value}}" v-model="inputmask" mask="*@*.a" />
          InputMask to be done with Vuelidate

        </div>
        <div v-else-if="value?.input_type === 'date'">
          <h3>{{ value?.label }}</h3>
          <Calendar inputId="basic" v-model="date1" :showIcon="true" dateFormat="dd.mm.yy" />

        </div>
        <div v-else-if="value?.input_type === 'number'">
          <h3>{{ value?.label }}</h3>
          <!-- bad hardcoding but how to assign membership.id if not possible in <script>?-->
          <InputText disabled v-model="membership[key]" />
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
