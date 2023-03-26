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
menuStore.setTitle("Payments");
</script>

<template>
  <div class="h-full tabview-full">
    <TabView lazy>
      <TabPanel :header="t('Payments')">
        <ObjectLoader
          :store="membersStore"
          :name="'paymentsPayments'"
          :default-columns="[
            'name',
            'status',
            'payer',
            'amount',
            'description',
          ]"
        />
      </TabPanel>
      <TabPanel :header="t('Subscriptions')">
        <ObjectLoader
          :store="membersStore"
          :name="'paymentsSubscriptions'"
          :default-columns="['name', 'payer', 'amount', 'description']"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
