<script setup lang="ts">
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const membersStore = useMembersStore();
const menuStore = useMenuStore();
menuStore.setTitle("Member Emails");
</script>

<template>
  <div class="h-full tabview-full">
    <TabView lazy>
      <TabPanel :header="t('Campaigns')">
        <ObjectLoader :store="membersStore" :name="'membersEmailsCampaigns'" />
      </TabPanel>
      <TabPanel :header="t('Templates')">
        <ObjectLoader :store="membersStore" :name="'membersEmailsTemplates'" />
      </TabPanel>
      <TabPanel :header="t('Designs')">
        <ObjectLoader :store="membersStore" :name="'membersEmailsDesigns'" />
      </TabPanel>
    </TabView>
  </div>
</template>
