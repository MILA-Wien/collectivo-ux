<script setup lang="ts">
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";
import { ref } from "vue";

import MembersTable from "./MembersTable.vue";

const menuStore = useMenuStore();
menuStore.setTitle("Members");

const membersStore = useMembersStore();
const { membersMembers, emailsCampaigns } = storeToRefs(membersStore);

const error = ref<Object | null>(null);

if (membersMembers.value.loaded === false) {
  membersStore.get("membersMembers").catch((e: any) => {
    error.value = e;
  });
}

if (emailsCampaigns.value.schemaLoaded === false) {
  membersStore.getSchema("emailsCampaigns").catch((e: any) => {
    error.value = e;
  });
}
</script>

<template>
  <div v-if="error !== null" class="error">
    <h2>{{ $t("Error while loading Members") }}</h2>
    <p class="error-message">{{ error }}</p>
  </div>
  <div
    v-else-if="
      membersMembers.loaded === false || emailsCampaigns.schemaLoaded === false
    "
    class="loading"
  >
    <h2>{{ $t("Loading members") }}</h2>
  </div>
  <div v-else class="h-full">
    <MembersTable
      :store="membersStore"
      name="membersMembers"
      :objects="membersMembers.data"
      :schema="membersMembers.schema"
      :emailCampaignSchema="emailsCampaigns.schema"
    />
  </div>
</template>

<style scoped>
.error-message {
  border: 1px solid red;
  padding: 10px;
  border-radius: 5px;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
</style>
