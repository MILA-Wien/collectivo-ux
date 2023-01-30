<script setup lang="ts">
import { ref } from "vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";
import MembersTable from "./MembersTable.vue";

const menuStore = useMenuStore();
menuStore.setTitle("Members");

const membersStore = useMembersStore();
const { membersSummary, membersEmailsCampaigns } = storeToRefs(membersStore);

const error = ref<Object | null>(null);

if (membersSummary.value.loaded === false) {
  membersStore.getList("membersSummary").catch((e: any) => {
    error.value = e;
  });
}

if (membersEmailsCampaigns.value.schemaLoaded === false) {
  membersStore.getSchema("membersEmailsCampaigns").catch((e: any) => {
    error.value = e;
  });
}
</script>

<template>
  <div class="members-wrapper">
    <div v-if="error !== null" class="error">
      <h2>{{ $t("Error while loading Members") }}</h2>
      <p class="error-message">{{ error }}</p>
    </div>
    <div
      v-else-if="
        membersSummary.loaded === false ||
        membersEmailsCampaigns.schemaLoaded === false
      "
      class="loading"
    >
      <h2>{{ $t("Loading members") }}</h2>
    </div>
    <div v-else class="members-table">
      <MembersTable
        :store="membersStore"
        name="membersSummary"
        :objects="membersSummary.data"
        :schema="membersSummary.schema"
        :emailCampaignSchema="membersEmailsCampaigns.schema"
      />
    </div>
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
