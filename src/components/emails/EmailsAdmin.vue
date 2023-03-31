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
menuStore.setTitle("Member Emails");
</script>
<template>
  <div class="h-full tabview-full">
    <TabView lazy>
      <TabPanel :header="t('Campaigns')">
        <ObjectLoader
          :store="membersStore"
          :name="'emailsCampaigns'"
          :defaultColumns="['status', 'template', 'recipients', 'automation']"
        />
      </TabPanel>
      <TabPanel :header="t('Templates')">
        <ObjectLoader
          :store="membersStore"
          :name="'emailsTemplates'"
          :defaultColumns="['name', 'subject', 'design']"
        />
      </TabPanel>
      <TabPanel :header="t('Designs')">
        <ObjectLoader
          :store="membersStore"
          :name="'emailsDesigns'"
          :defaultColumns="['name', 'body']"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
