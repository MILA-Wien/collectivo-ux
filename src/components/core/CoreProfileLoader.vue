<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";
import PrimeButton from "primevue/button";
import PrimeProgressSpinner from "primevue/progressspinner";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import CoreProfile from "./CoreProfile.vue";
const { t } = useI18n();
const menuStore = useMenuStore();
menuStore.setTitle("Membership");
const error = ref<Object | null>(null);
const mainStore = useMainStore();
mainStore.get("profilesProfilesSelf").catch((e: any) => {
  error.value = e;
});
const { profilesProfilesSelf } = storeToRefs(mainStore);
</script>

<template>
  <div v-if="error !== null">
    <p class="pb-2">
      {{ t("Could not find any membership data.") }} {{ error }}
    </p>
    <RouterLink to="/">
      <PrimeButton> {{ t("Back to homepage") }} </PrimeButton>
    </RouterLink>
  </div>
  <div v-else-if="!profilesProfilesSelf.detailLoaded">
    <PrimeProgressSpinner />
  </div>
  <div v-else id="core-profile">
    <CoreProfile
      :membership="profilesProfilesSelf.detail"
      :membershipSchema="profilesProfilesSelf.schema.fields"
      id="members-profile"
    />
  </div>
</template>

<style scoped>
.error-message {
  border: 1px solid red;
  padding: 10px;
  border-radius: 5px;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
</style>
