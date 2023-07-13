<script setup lang="ts">
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
import ObjectMasonry from "@/components/datatable/ObjectMasonry.vue";
import ObjectTable from "@/components/datatable/ObjectTable.vue";
import { extensions } from "@/helpers/settings";
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
import PrimePanel from "primevue/panel";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useI18n } from "vue-i18n";
import ObjectList from "../datatable/ObjectList.vue";

const { t } = useI18n();
const menuStore = useMenuStore();
const mainStore = useMainStore();
menuStore.setTitle("Settings");

// Core profile endpoints
const settings_endpoints: Array<String> = ["coreSettings"];

// Import additional profile endpoints from extensions
for (const extension of extensions) {
  if (extension.settings_endpoints !== undefined) {
    for (const key of extension.settings_endpoints) {
      settings_endpoints.push(key);
    }
  }
}
</script>

<template>
  <div class="h-full tabview-full-height" id="core-settings">
    <TabView lazy>
      <TabPanel :header="t('Settings')">
        <ObjectMasonry :items="settings_endpoints">
          <template #item="{ item }">
            <ObjectDetail :store="mainStore" :name="item"> </ObjectDetail>
          </template>
        </ObjectMasonry>
      </TabPanel>
      <TabPanel :header="t('Extensions')">
        <ObjectList :store="mainStore" :name="'extensionsExtensions'">
          <template #item="slotProps">
            <PrimePanel :header="slotProps.data.label" class="mb-5">
              <p class="pb-3">{{ slotProps.data.description }}</p>
              <p>{{ t("Active") }}: {{ slotProps.data.active }}</p>
              <p>{{ t("Built-in") }}: {{ slotProps.data.built_in }}</p>
              <p v-if="slotProps.data.version">
                {{ t("Version") }}: {{ slotProps.data.version }}
              </p>
            </PrimePanel>
          </template>
        </ObjectList>
      </TabPanel>
      <TabPanel :header="t('Dashboard')">
        <ObjectTable
          :store="mainStore"
          name="dashboardTiles"
          :default-columns="['name', 'content']"
        />
      </TabPanel>
      <TabPanel :header="t('Buttons')">
        <ObjectTable
          :store="mainStore"
          name="dashboardTileButtons"
          :default-columns="['label']"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
