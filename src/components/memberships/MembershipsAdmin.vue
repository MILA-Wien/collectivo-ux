<script setup lang="ts">
import ObjectList from "@/components/datatable/ObjectList.vue";
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import PrimePanel from "primevue/panel";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const membersStore = useMembersStore();
const menuStore = useMenuStore();
menuStore.setTitle("Memberships");
</script>

<template>
  <div class="h-full tabview-full-height" id="members-admin">
    <TabView lazy>
      <TabPanel :header="t('Memberships')">
        <ObjectLoader
          :store="membersStore"
          :name="'membershipsMemberships'"
          :default-columns="[
            'user__first_name',
            'user__last_name',
            'user__tags',
            'type',
            'number',
            'status',
            'shares_signed',
          ]"
          :email-button="true"
        />
      </TabPanel>
      <TabPanel :header="t('Types')">
        <ObjectLoader
          :store="membersStore"
          :name="'membershipsTypes'"
          :default-columns="['name']"
        />
      </TabPanel>
      <TabPanel :header="t('Statuses')">
        <ObjectLoader
          :store="membersStore"
          :name="'membershipsStatuses'"
          :default-columns="['name']"
        />
      </TabPanel>
      <TabPanel :header="t('Statistics')">
        <ObjectList :store="membersStore" :name="'membershipsTypes'">
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
