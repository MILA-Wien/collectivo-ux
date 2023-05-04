<script setup lang="ts">
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";
import { errorToast, successToast } from "@/helpers/toasts";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import PrimeButton from "primevue/button";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const membersStore = useMembersStore();
const menuStore = useMenuStore();
const toast = useToast();
menuStore.setTitle("Payments");

const syncing_lotzapp_addresses = ref(false);
async function sync_lotzapp_addresses() {
  syncing_lotzapp_addresses.value = true;
  try {
    await membersStore.create("lotzappAddressesSync");
    successToast(toast, t("Addresses synchronized"));
  } catch (e) {
    errorToast(toast, e);
  }
  syncing_lotzapp_addresses.value = false;
}

const syncing_lotzapp_invoices = ref(false);
async function sync_lotzapp_invoices() {
  syncing_lotzapp_invoices.value = true;
  try {
    await membersStore.create("lotzappInvoicesSync");
    successToast(toast, t("Invoices synchronized"));
  } catch (e) {
    errorToast(toast, e);
  }
  syncing_lotzapp_invoices.value = false;
}
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
        <PrimeButton
          @click="sync_lotzapp_addresses()"
          style="margin: 5px"
          icon="pi pi-refresh"
          :loading="syncing_lotzapp_addresses"
          :label="'Synchronize addresses'"
        />
        <PrimeButton
          @click="sync_lotzapp_invoices()"
          style="margin: 5px"
          icon="pi pi-refresh"
          :loading="syncing_lotzapp_invoices"
          :label="'Synchronize invoices'"
        />
        <ObjectDetail :store="membersStore" :name="'lotzappSettings'">
        </ObjectDetail>
      </TabPanel>
    </TabView>
  </div>
</template>
