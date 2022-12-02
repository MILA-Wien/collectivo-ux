<script lang="ts" setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
<template>
  <div>
    <p>
      <b>{{ t("Important:") }}</b>
      {{ t("Registration hasn't finished yet please continue here.") }}
    </p>
    <RouterLink to="/membership/registration">
      <ButtonPrime> {{ t("next") }} </ButtonPrime>
    </RouterLink>
  </div>
</template>
