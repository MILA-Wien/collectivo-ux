<script setup lang="ts">
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
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
  <div class="h-full tabview-full-height">
    <TabView lazy>
      <TabPanel :header="t('Invoices')">
        <ObjectLoader
          :store="membersStore"
          :name="'paymentsInvoices'"
          :default-columns="[
            'status',
            'date',
            'amount',
            'payment_from',
            'items',
          ]"
        />
      </TabPanel>
      <TabPanel :header="t('Subscriptions')">
        <ObjectLoader
          :store="membersStore"
          :name="'paymentsSubscriptions'"
          :default-columns="[
            'status',
            'amount',
            'payment_from',
            'date_started',
            'items',
          ]"
        />
      </TabPanel>
      <!-- TODO: This code is custom for MILA and should be moved -->
      <TabPanel :header="t('Lotzapp')">
        <ObjectLoader
          :store="membersStore"
          :name="'lotzappSync'"
          :default-columns="['date', 'status', 'type', 'status_message']"
        />
      </TabPanel>
      <TabPanel :header="t('Lotzapp Settings')">
        <ObjectDetail :store="membersStore" :name="'lotzappSettings'">
        </ObjectDetail>
      </TabPanel>
    </TabView>
  </div>
</template>
