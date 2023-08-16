<script setup lang="ts">
import ObjectTable from "@/components/datatable/ObjectTable.vue";
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const mainStore = useMainStore();
const menuStore = useMenuStore();
menuStore.setTitle("Emails");
</script>
<template>
  <div class="h-full tabview-full-height">
    <TabView lazy>
      <TabPanel :header="t('Campaigns')">
        <ObjectTable
          :store="mainStore"
          :name="'emailsCampaigns'"
          :defaultColumns="['status', 'template', 'recipients', 'automation']"
        />
      </TabPanel>
      <TabPanel :header="t('Templates')">
        <ObjectTable
          :store="mainStore"
          :name="'emailsTemplates'"
          :defaultColumns="['name', 'subject', 'design']"
        />
      </TabPanel>
      <TabPanel :header="t('Designs')">
        <ObjectTable
          :store="mainStore"
          :name="'emailsDesigns'"
          :defaultColumns="['name', 'body']"
        />
      </TabPanel>
      <TabPanel :header="t('Automations')">
        <ObjectTable
          :store="mainStore"
          :name="'emailsAutomations'"
          :defaultColumns="['label', 'extension', 'is_active']"
        />
      </TabPanel>
      <TabPanel :header="t('Senders')">
        <ObjectTable
          :store="mainStore"
          :name="'emailsSenderConfigs'"
          :defaultColumns="['name', 'from_email']"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
