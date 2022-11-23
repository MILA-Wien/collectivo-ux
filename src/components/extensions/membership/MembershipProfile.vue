<script setup lang="ts">
import { useMembershipStore } from "@/stores/membership";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import InputMask from "primevue/inputmask";
import InputSwitch from 'primevue/inputswitch';
import Listbox from 'primevue/listbox';
import Calendar from 'primevue/calendar';
import { ref } from 'vue';

const storeVersion = useSettingsStore();
storeVersion.getVersion();
const membershipStore = useMembershipStore();
membershipStore.getMembership();
const { t } = useI18n();
const checked = ref(true);
const selectedCities1 = ref();
const citiesForRadioButton = ref([
  { key: "0", label: "Diverse"},
  { key: "1", label: "Female"},
  { key: "2", label: "Male"},
]);
const cities = ref([
            {name: 'New York', code: 'NY'},
            {name: 'Rome', code: 'RM'},
            {name: 'London', code: 'LDN'},
        ]);
const date1 = ref();
const value1 = ref(42);
const inputmask = ref("InputMask@input.com");

const { membership } = storeToRefs(membershipStore);

function updateInputText(event: any, key: string) {
  console.log("event", event.target.value)
  if (membership)
    //@ts-ignore
    membership.value[key] = event.target.value;
}

function save() {
  if (membership.value) {
    membershipStore.updateMembership(membership.value);
  }
}
</script>

<template>
  <div>
    <div v-if="membership === null" class="loading">
      <h2>{{ $t("Loading members") }}</h2>
    </div>
    <div v-else class="members-table">
      <div v-for="(value, key) in membership " :key="value ? key + value : key" class="field">
        <!-- <strong for="user-attr-{{value}}">{{ key }}</strong> -->
        <div v-if="value?.input_type === 'text'">
          <br />
          <InputText id="user-attr-{{value}}" :type="value?.input_type" aria-describedby="user-attr-{{value}}-help"
            @change="updateInputText($event, key)" :value="value" :disabled="key === 'id'" />
          {{ value }}
        </div>
        <div v-else-if="value?.input_type === 'checkbox'">
          <InputSwitch v-model="checked" />
          {{ value }} boolean in Django als Übergabe?
        </div>
        <div v-else-if="value?.input_type === 'select'">
          <Listbox v-model="selectedCities1" :options="cities" optionLabel="name" placeholder="Select Gender(s)" />

          {{ value }} boolean in Django als Übergabe?
        </div>
        <div v-else-if="value?.input_type === 'email'">
          <InputMask id="user-attr-{{value}}" v-model="inputmask" mask="*@*.a"/>
          InputMask
          {{ value }}
        </div>
        <div v-else-if="value?.input_type === 'date'">
          <Calendar inputId="basic" v-model="date1" :showIcon="true" dateFormat="dd.mm.yy" />
          {{ value }}
        </div>
        <div v-else-if="value?.input_type === 'number'">
          <InputNumber inputId="integeronly" v-model="value1" />
         {{ value }}
        </div>
        <div v-else>
          <InputText id="user-attr-{{value}}" :type="value?.input_type" aria-describedby="user-attr-{{value}}-help"
            @change="updateInputText($event, key)" :value="value" :disabled="key === 'id'" />
          Else-Case!!
          {{ value }}

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
