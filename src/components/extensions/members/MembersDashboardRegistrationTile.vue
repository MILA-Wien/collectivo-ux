<script lang="ts" setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
<template>
  <div id="members-registration-tile">
    <p class="pb-4">
      {{
        t(
          "Click here to fill out your application to become a member of the MILA cooperative."
        )
      }}
    </p>
    <RouterLink to="/membership/registration">
      <ButtonPrime id="members-registration-tile-continue"> {{ t("Continue") }} </ButtonPrime>
    </RouterLink>
  </div>
</template>
