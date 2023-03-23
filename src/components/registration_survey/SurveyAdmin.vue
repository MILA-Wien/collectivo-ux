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
menuStore.setTitle("Survey");
</script>

<template>
  <div class="h-full tabview-full">
    <TabView lazy>
      <TabPanel :header="t('Survey')">
        <ObjectLoader
          :store="membersStore"
          :name="'registrationSurvey'"
          :default-columns="['name']"
        />
      </TabPanel>
      <TabPanel :header="t('Groups')">
        <ObjectLoader
          :store="membersStore"
          :name="'registrationSurveyGroups'"
          :default-columns="['name']"
        />
      </TabPanel>
      <TabPanel :header="t('Skills')">
        <ObjectLoader
          :store="membersStore"
          :name="'registrationSurveySkills'"
          :default-columns="['name']"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
