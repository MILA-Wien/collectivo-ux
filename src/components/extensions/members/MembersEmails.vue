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
  <TabView lazy>
    <TabPanel header="Overview"> Content I </TabPanel>
    <TabPanel header="Campaigns">
      <ObjectLoader :store="membersStore" :name="'membersEmailsCampaigns'" />
    </TabPanel>
    <TabPanel header="Templates">
      <ObjectLoader :store="membersStore" :name="'membersEmailsTemplates'" />
    </TabPanel>
    <TabPanel header="Designs">
      <ObjectLoader :store="membersStore" :name="'membersEmailsDesigns'" />
    </TabPanel>
  </TabView>
</template>

<style scoped></style>
