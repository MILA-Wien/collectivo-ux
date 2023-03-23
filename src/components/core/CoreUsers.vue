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
menuStore.setTitle("Accounts");
</script>

<template>
  <div class="h-full tabview-full">
    <TabView lazy>
      <TabPanel :header="t('Accounts')">
        <ObjectLoader
          :store="membersStore"
          :name="'coreUsers'"
          :default-columns="['first_name', 'last_name', 'email', 'groups']"
        />
      </TabPanel>
      <TabPanel :header="t('Permissions')">
        <ObjectLoader
          :store="membersStore"
          :name="'coreGroups'"
          :default-columns="['name']"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
