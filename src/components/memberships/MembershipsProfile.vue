<script setup lang="ts">
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import PrimePanel from "primevue/panel";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const membersStore = useMembersStore();
const menuStore = useMenuStore();
menuStore.setTitle("My memberships");
</script>

<template>
  <div class="h-full tabview-full" id="memberships-profile">
    <ObjectLoader
      :store="membersStore"
      :name="'membershipsMembershipsSelf'"
      :display-type="'list'"
    >
      <template #item="slotProps">
        <PrimePanel :header="slotProps.data.type.name" class="mb-5">
          <p v-html="slotProps.data.type.description" class="mb-3"></p>

          <p>
            {{ t("Membership number") }}:
            <span class="">{{ slotProps.data.number }}</span>
            <br />
            {{ t("Date joined") }}:
            <span class="">{{ slotProps.data.date_started }}</span>
            <br />
            {{ t("Status") }}:
            <span class="">{{ slotProps.data.status.name }}</span>
          </p>
          <p v-if="slotProps.data.type.has_shares">
            {{ t("Signed shares") }}: {{ slotProps.data.shares_signed }}
          </p>
        </PrimePanel>
      </template>
    </ObjectLoader>
  </div>
</template>
