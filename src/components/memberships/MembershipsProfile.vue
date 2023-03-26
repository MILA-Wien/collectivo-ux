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
          <p>
            Deine Mitgliedsnummer:
            <span class="font-bold">{{ slotProps.data.number }}</span>
          </p>
          <p>
            Dein Status:
            <span class="font-bold">{{ slotProps.data.status.name }}</span>
          </p>
          <!-- <p>Beitrittsdatum: {{ prop.data.date_started }}</p> -->
          <p v-if="slotProps.data.type.has_shares">
            Unterschriebene Anteile: {{ slotProps.data.shares_signed }}
            <!-- <br />
              Unterschriebene Anteile: {{ prop.data.shares_paid }} -->
          </p>
        </PrimePanel>
      </template>
    </ObjectLoader>
  </div>
</template>
