<script setup lang="ts">
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";

const membersStore = useMembersStore();
const menuStore = useMenuStore();
menuStore.setTitle("Member Tags");
</script>

<template>
  <div class="h-full tabview-full">
    <TabView lazy>
      <TabPanel header="Tags">
        <ObjectLoader :store="membersStore" :name="'membersTags'" />
      </TabPanel>
    </TabView>
  </div>
</template>
