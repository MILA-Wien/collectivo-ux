<script setup lang="ts">
import ObjectList from "@/components/datatable/ObjectList.vue";
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
import PrimePanel from "primevue/panel";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const mainStore = useMainStore();
const menuStore = useMenuStore();
menuStore.setTitle("Memberships");
</script>

<template>
  <div class="h-full tabview-full-height" id="members-admin">
    <TabView lazy>
      <TabPanel :header="t('Memberships')">
        <ObjectLoader
          :store="mainStore"
          :name="'membershipsMemberships'"
          :default-columns="[
            'user__first_name',
            'user__last_name',
            'stage',
            'type',
            'status',
          ]"
          :email-button="true"
        />
      </TabPanel>
      <TabPanel :header="t('Types')">
        <ObjectLoader
          :store="mainStore"
          :name="'membershipsTypes'"
          :default-columns="['name']"
        />
      </TabPanel>
      <TabPanel :header="t('Statuses')">
        <ObjectLoader
          :store="mainStore"
          :name="'membershipsStatuses'"
          :default-columns="['name']"
        />
      </TabPanel>
      <TabPanel :header="t('Statistics')">
        <ObjectList :store="mainStore" :name="'membershipsTypes'">
          <template #item="slotProps">
            <PrimePanel :header="slotProps.data.name" class="mb-5">
              <p
                v-for="(value, name, index) in slotProps.data.statistics"
                :key="index"
              >
                <span class="">{{ name }}:</span> {{ value }}
              </p>
            </PrimePanel>
          </template>
        </ObjectList>
      </TabPanel>
    </TabView>
  </div>
</template>
