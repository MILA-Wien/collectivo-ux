<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
import PrimeButton from "primevue/button";
import PrimeColumn from "primevue/column";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useI18n } from "vue-i18n";
import ObjectTable from "../datatable/ObjectTable.vue";
const { t } = useI18n();
const mainStore = useMainStore();
const menuStore = useMenuStore();
menuStore.setTitle("Users");
const view_groups = mainStore.hasPermission("view_groups", "core");
</script>

<template>
  <div class="h-full tabview-full-height" id="core-users">
    <TabView lazy>
      <TabPanel :header="t('Users')">
        <ObjectTable
          :store="mainStore"
          :name="'coreUsersExtended'"
          :default-columns="['first_name', 'last_name', 'email', 'tags']"
          :email-button="true"
        >
          <template #action-column>
            <PrimeColumn style="width: 45px; max-width: 45px" :frozen="true">
              <template #header
                ><PrimeButton
                  icon="pi pi-eye"
                  class="p-button-text p-button-sm button-edit"
                  disabled="true"
              /></template>
              <template #body="slotProps">
                <PrimeButton
                  icon="pi pi-eye"
                  class="p-button-text p-button-sm button-edit"
                  @click="
                    $router.push('/core/users/' + slotProps.data.id + '/')
                  "
                />
              </template>
            </PrimeColumn>
          </template>
        </ObjectTable>
      </TabPanel>
      <TabPanel :header="t('Groups')" v-if="view_groups">
        <ObjectTable
          :store="mainStore"
          :name="'coreGroups'"
          :default-columns="['name', 'permissions', 'extension', 'users']"
        >
        </ObjectTable>
      </TabPanel>
    </TabView>
  </div>
</template>
