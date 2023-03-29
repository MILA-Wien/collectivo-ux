<script lang="ts" setup>
import PrimeButton from "primevue/button";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
<template>
  <div>
    <p class="pb-4">
      {{ t("Click here to see your direct loans at MILA.") }}
    </p>
    <PrimeButton> {{ t("MILA Direct Loans System") }} </PrimeButton>
  </div>
</template>
