<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import PrimeButton from "primevue/button";
const { t } = useI18n();
</script>
<template>
  <div>
    <p class="pb-4">
      {{
        t(
          "Click here to fill out your application to become a member of the MILA cooperative."
        )
      }}
    </p>
    <RouterLink to="/members/registration">
      <PrimeButton> {{ t("Continue") }} </PrimeButton>
    </RouterLink>
  </div>
</template>
