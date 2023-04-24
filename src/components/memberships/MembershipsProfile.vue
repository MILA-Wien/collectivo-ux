<script setup lang="ts">
import ObjectDetailNew from "@/components/datatable/ObjectDetailNew.vue";
import ObjectListNew from "@/components/datatable/ObjectListNew.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import PrimeButton from "primevue/button";
import PrimePanel from "primevue/panel";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const membersStore = useMembersStore();
const menuStore = useMenuStore();
const objectName = "membershipsMembershipsSelf";
menuStore.setTitle("My memberships");

const signSharesLabel = t("Sign additional shares");
const signSharesData = ref({});
const signSharesDialog = ref(false);
</script>

<template>
  <div class="h-full tabview-full-height" id="memberships-profile">
    <ObjectListNew :store="membersStore" :name="'membershipsMembershipsSelf'">
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

          <PrimeButton
            v-if="slotProps.data.type.has_shares"
            icon="pi pi-pencil"
            :label="signSharesLabel"
            @click="
              signSharesDialog = true;
              signSharesData = slotProps.data;
            "
          ></PrimeButton>
        </PrimePanel>
      </template>
    </ObjectListNew>
    <ObjectDetailNew
      v-if="signSharesDialog"
      :store="membersStore"
      :header="signSharesLabel"
      :name="'membershipsMembershipsShares'"
      :object="signSharesData"
      :actions="[
        {
          action: 'Submit',
          label: t('Submit'),
          icon: 'pi pi-pencil',
          confirm: true,
        },
      ]"
      @close="signSharesDialog = false"
    />
  </div>
</template>
