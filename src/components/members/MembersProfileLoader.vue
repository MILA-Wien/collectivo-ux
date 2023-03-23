<script setup lang="ts">
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";
import PrimeButton from "primevue/button";
import PrimeProgressSpinner from "primevue/progressspinner";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import MembersProfile from "./MembersProfile.vue";
const { t } = useI18n();
const menuStore = useMenuStore();
menuStore.setTitle("Membership");
const error = ref<Object | null>(null);
const membersStore = useMembersStore();
membersStore.get("membersProfile").catch((e: any) => {
  error.value = e;
});
const { membersProfile } = storeToRefs(membersStore);
</script>

<template>
  <div v-if="error !== null">
    <p class="pb-2">
      {{ t("Could not find any membership data.") }}
    </p>
    <RouterLink to="/">
      <PrimeButton> {{ t("Back to homepage") }} </PrimeButton>
    </RouterLink>
  </div>
  <div v-else-if="!membersProfile.loaded">
    <PrimeProgressSpinner />
  </div>
  <div v-else>
    <MembersProfile
      :membership="membersProfile.data"
      :membershipSchema="membersProfile.schema"
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
