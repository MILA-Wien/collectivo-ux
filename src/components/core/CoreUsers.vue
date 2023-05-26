<script setup lang="ts">
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
import PrimeButton from "primevue/button";
import PrimeColumn from "primevue/column";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const mainStore = useMainStore();
const menuStore = useMenuStore();
menuStore.setTitle("Users");
</script>

<template>
  <div class="h-full tabview-full-height" id="core-users">
    <TabView lazy>
      <TabPanel :header="t('Users')">
        <ObjectLoader
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
        </ObjectLoader>
      </TabPanel>
    </TabView>
  </div>
</template>
