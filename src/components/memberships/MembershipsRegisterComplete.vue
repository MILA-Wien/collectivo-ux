<script setup lang="ts">
import type { DataSchema } from "@/api/types";
import { useMainStore } from "@/stores/main";
import PrimeButton from "primevue/button";
import type { PropType } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();
const mainStore = useMainStore();
const route = useRoute();

const props = defineProps({
  data: {
    type: Object as PropType<DataSchema>,
    required: true,
  },
});
</script>

<template>
  <div class="grow overflow-auto p-5 bg-white">
    <div class="flex flex-col h-full">
      <h2>
        {{ t("Your registration was successful!") }}
      </h2>

      <div>
        <RouterLink to="/">
          <PrimeButton
            :label="t('Back to dashboard')"
            icon="pi pi-home"
            class="flex-none"
        /></RouterLink>
      </div>
    </div>
  </div>
</template>
