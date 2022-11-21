<script setup lang="ts">
import { useMembershipStore } from "@/stores/profile";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import InputText from "primevue/inputtext";

const storeVersion = useSettingsStore();
storeVersion.getVersion();
const membershipStore = useMembershipStore();
membershipStore.getMembership();
const { t } = useI18n();


const { membership } = storeToRefs(membershipStore);

function updateInputText(event:any, key:string) {
  console.log("event", event.target.value)
  if(membership)
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
      <!-- <div v-for="(value, key) in membership " :key="value ? key + value : key" class="field">
        <strong for="user-attr-{{value}}">{{ key }}</strong>
        <br />
        <InputText id="user-attr-{{value}}" type="text" aria-describedby="user-attr-{{value}}-help"
          @change="updateInputText($event, key)"
          :value="value"
          :disabled="key === 'id'" />
      </div> -->
      {{membership}}
      <br />
      <ButtonPrime :label="t('Save')" icon="pi pi-check" @click="save()" autofocus />
    </div>
    <p>{{membership}}</p>
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
