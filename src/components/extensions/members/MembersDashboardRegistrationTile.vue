<script lang="ts" setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
<template>
  <div>
    <p>
      {{ t("Click here to fill out your application to become a member of the MILA cooperative.") }}
    </p>
    <RouterLink to="/membership/registration">
      <ButtonPrime> {{ t("Continue") }} </ButtonPrime>
    </RouterLink>
  </div>
</template>
Beitrittserklärung zur MILA Genossenschaft in Gründung
