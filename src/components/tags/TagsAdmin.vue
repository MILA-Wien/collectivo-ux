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
menuStore.setTitle("Tags");
</script>

<template>
  <div class="h-full tabview-full" id="tags-admin">
    <TabView lazy>
      <TabPanel :header="t('Tags')">
        <ObjectLoader
          :store="membersStore"
          :name="'tagsTags'"
          :default-columns="['name']"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
