<script setup lang="ts">
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";

const membersStore = useMembersStore();
const menuStore = useMenuStore();
menuStore.setTitle("Member Emails");
</script>
<template>
  <div class="h-full tabview-full">
    <TabView lazy>
      <TabPanel header="Campaigns">
        <ObjectLoader
          :store="membersStore"
          :name="'membersEmailsCampaigns'"
          :defaultColumns="['status', 'template', 'recipients', 'automation']"
        />
      </TabPanel>
      <TabPanel header="Templates">
        <ObjectLoader
          :store="membersStore"
          :name="'membersEmailsTemplates'"
          :defaultColumns="['name', 'subject', 'design']"
        />
      </TabPanel>
      <TabPanel header="Designs">
        <ObjectLoader
          :store="membersStore"
          :name="'membersEmailsDesigns'"
          :defaultColumns="['name', 'body']"
        />
      </TabPanel>
      <TabPanel header="Automations">
        <ObjectLoader
          :store="membersStore"
          :name="'membersEmailsAutomations'"
          :defaultColumns="['trigger', 'template']"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
