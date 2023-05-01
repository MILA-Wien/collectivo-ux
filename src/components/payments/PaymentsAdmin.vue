<script setup lang="ts">
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useI18n } from "vue-i18n";
import PrimeButton from "primevue/button";
import { useToast } from "primevue/usetoast";
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
import { API } from "@/api/api";
import { successToast, errorToast } from "@/helpers/toasts";

const { t } = useI18n();
const membersStore = useMembersStore();
const menuStore = useMenuStore();
const toast = useToast();
menuStore.setTitle("Payments");

async function sync_lotzapp_addresses() {
  try {
    const response = await API.post("lotzappAddressesSync", undefined);
    successToast(toast, t("Addresses synchronized"));
  } catch (e) {
    errorToast(toast, e);
  }
}

async function sync_lotzapp_invoices() {
  try {
    const response = await API.post("lotzappInvoicesSync", undefined);
    successToast(toast, t("Invoices synchronized"));
  } catch (e) {
    errorToast(toast, e);
  }
}
</script>

<template>
  <div class="h-full tabview-full-height">
    <TabView lazy>
      <TabPanel :header="t('Invoices')">
        <ObjectLoader
          :store="membersStore"
          :name="'paymentsInvoices'"
          :default-columns="['status', 'amount', 'payment_from', 'items']"
        />
      </TabPanel>
      <TabPanel :header="t('Subscriptions')">
        <ObjectLoader
          :store="membersStore"
          :name="'paymentsSubscriptions'"
          :default-columns="['name', 'payer', 'amount', 'description']"
        />
      </TabPanel>
      <!-- TODO: This code is custom for MILA and should be moved -->
      <TabPanel :header="t('Lotzapp')">
        <PrimeButton @click="sync_lotzapp_addresses()" style="margin: 5px"
          >Synchronize addresses
        </PrimeButton>
        <PrimeButton @click="sync_lotzapp_invoices()" style="margin: 5px"
          >Synchronize invoices
        </PrimeButton>
        <ObjectDetail :store="membersStore" :name="'lotzappSettings'">
        </ObjectDetail>
      </TabPanel>
    </TabView>
  </div>
</template>
