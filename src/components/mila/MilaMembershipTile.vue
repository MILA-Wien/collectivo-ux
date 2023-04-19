<script lang="ts" setup>
import { useMembersStore } from "@/stores/members";
import PrimeButton from "primevue/button";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const membersStore = useMembersStore();

const { t } = useI18n();

const has_mila_membership = ref<boolean | null>(null);
membersStore
  .getMilaMembershipNumber()
  .catch(() => {})
  .then((res) => {
    has_mila_membership.value = res ? res : false;
  });
</script>
<template>
  <div v-if="has_mila_membership === null">Loading</div>
  <div v-else-if="has_mila_membership != false">
    <p>
      {{ t("You are a member of") + " MILA Mitmach-Supermarkt e.G." }}
      <br />
      {{ t("Your membership number is") + ": " + has_mila_membership }}
    </p>
    <RouterLink to="/memberships/profile">
      <PrimeButton> {{ t("My memberships") }} </PrimeButton>
    </RouterLink>
  </div>
  <div v-else>
    <p>
      {{
        t(
          "Click here to fill out your application to become a member of the MILA cooperative."
        )
      }}
    </p>
    <RouterLink to="/mila/registration">
      <PrimeButton> {{ t("Continue") }} </PrimeButton>
    </RouterLink>
  </div>
</template>
