<script setup lang="ts">
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";
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
        <ObjectLoader
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
        <ObjectLoader
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
      <!-- TODO: This code is custom for MILA and should be moved -->
      <TabPanel :header="t('Lotzapp')">
        <ObjectLoader
          :store="mainStore"
          :name="'lotzappSync'"
          :default-columns="['date', 'status', 'type', 'status_message']"
        />
      </TabPanel>
      <TabPanel :header="t('Lotzapp Settings')">
        <ObjectDetail :store="mainStore" :name="'lotzappSettings'">
        </ObjectDetail>
      </TabPanel>
    </TabView>
  </div>
</template>
