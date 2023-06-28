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
menuStore.setTitle("Payments");
</script>

<template>
  <div class="h-full tabview-full-height">
    <TabView lazy>
      <TabPanel :header="t('Invoices')">
        <ObjectTable
          :store="mainStore"
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
        <ObjectTable
          :store="mainStore"
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
    </TabView>
  </div>
</template>
