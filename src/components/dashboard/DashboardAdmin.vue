<script setup lang="ts">
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const membersStore = useMembersStore();
const menuStore = useMenuStore();
menuStore.setTitle("Tiles");
</script>

<template>
  <div class="h-full tabview-full" id="dashboard-admin">
    <TabView lazy>
      <TabPanel :header="t('Tiles')">
        <ObjectLoader
          :store="membersStore"
          name="dashboardTiles"
          :default-columns="['name', 'content']"
        />
      </TabPanel>
      <TabPanel :header="t('Buttons')">
        <ObjectLoader
          :store="membersStore"
          name="dashboardTileButtons"
          :default-columns="['label']"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
