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
menuStore.setTitle("Tags");
</script>

<template>
  <div class="h-full tabview-full-height" id="tags-admin">
    <TabView lazy>
      <TabPanel :header="t('Tags')">
        <ObjectTable
          :store="mainStore"
          name="tagsTags"
          :default-columns="['name', 'description']"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
