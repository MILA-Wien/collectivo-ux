<script setup lang="ts">
import ObjectList from "@/components/datatable/ObjectList.vue";
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import PrimePanel from "primevue/panel";
import PrimeButton from "primevue/button";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { useI18n } from "vue-i18n";
import { API } from "@/api/api";
import { useToast } from "primevue/usetoast";
import { successToast, errorToast } from "@/helpers/toasts";
const toast = useToast();
const { t } = useI18n();
const membersStore = useMembersStore();
const menuStore = useMenuStore();
menuStore.setTitle("Memberships");

async function generate_invoices() {
  try {
    await API.post("membershipsCreateInvoices", undefined);
    successToast(toast, t("Addresses synchronized"));
  } catch (e) {
    errorToast(toast, e);
  }
}
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
      <TabPanel :header="t('Actions')">
        <PrimeButton @click="generate_invoices()"
          >Generate invoices</PrimeButton
        >
      </TabPanel>
    </TabView>
  </div>
</template>
