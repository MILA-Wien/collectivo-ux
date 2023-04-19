<script setup lang="ts">
import { useMenuStore } from "@/stores/menu";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const menuStore = useMenuStore();
menuStore.setTitle("Settings");
</script>

<template>
  <div class="h-full tabview-full-height">
    <TabView lazy>
      <TabPanel :header="t('Settings')">
        {{ t("Coming soon.") }}
      </TabPanel>
    </TabView>
  </div>
</template>
