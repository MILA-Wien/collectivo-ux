<script setup lang="ts">
import { useMenuStore } from "@/stores/menu";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const menuStore = useMenuStore();
menuStore.setTitle("Payments");
</script>

<template>
  <div class="h-full tabview-full">
    <TabView lazy>
      <TabPanel :header="t('Payments')">
        {{ t("Coming soon.") }}
      </TabPanel>
    </TabView>
  </div>
</template>
