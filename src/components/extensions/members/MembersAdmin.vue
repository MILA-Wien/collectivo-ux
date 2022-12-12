<script setup lang="ts">
import { ref } from "vue";
import type { Member } from "@/api/types";
import { useMembersStore } from "@/stores/members";
import { storeToRefs } from "pinia";
import MembersTable from "./MembersTable.vue";
import { useToast } from  "primevue/usetoast";

const toast = useToast();

const editMember = ref(false)
const membersStore = useMembersStore();
if (membersStore.membersLoaded === false) {
  membersStore.getMembers();
}
const { members, membersLoadingError } = storeToRefs(membersStore);

function deleteMember(member: Member) {
  membersStore.deleteMember(member);
}
</script>

<template>
  <div class="members-wrapper">
    <div v-if="membersLoadingError !== null" class="error">
      <h2>{{ $t("Error while loading Members") }}</h2>
      <p class="error-message">{{ membersLoadingError }}</p>
    </div>
    <div v-else-if="members === null" class="loading">
      <h2>{{ $t("Loading members") }}</h2>
    </div>
    <div v-else class="members-table">
      <MembersTable
        :members="members"
        :editMember="editMember"
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
