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
menuStore.setTitle("Users");
</script>

<template>
  <div class="h-full tabview-full" id="core-users">
    <TabView lazy>
      <TabPanel :header="t('Accounts')">
        <ObjectLoader
          :store="membersStore"
          :name="'coreUsers'"
          :default-columns="['first_name', 'last_name', 'email']"
          :email-button="true"
        />
      </TabPanel>
      <TabPanel :header="t('Profile data')">
        <ObjectLoader
          :store="membersStore"
          :name="'profilesProfiles'"
          :default-columns="[
            'user__first_name',
            'user__last_name',
            'user__tags',
            'person_type',
          ]"
          :email-button="true"
        />
      </TabPanel>
      <TabPanel :header="t('Payment data')">
        <ObjectLoader
          :store="membersStore"
          :name="'paymentsProfiles'"
          :default-columns="[
            'first_name',
            'last_name',
            'user',
            'payment_method',
          ]"
          :email-button="true"
        />
      </TabPanel>
      <TabPanel :header="t('Survey data')">
        <ObjectLoader
          :store="membersStore"
          :name="'milaProfiles'"
          :default-columns="[
            'first_name',
            'last_name',
            'email',
            'user',
            'groups_interested',
            'skills',
          ]"
          :email-button="true"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
