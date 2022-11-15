<script setup lang="ts">
import type { Member } from "@/api/types";
import { useMembershipStore } from "@/stores/membership";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import MembershipTable from "./MembershipTable.vue";
// import { useMembersStore } from "@/stores/members";


const storeVersion = useSettingsStore();
storeVersion.getVersion();
const membershipStore = useMembershipStore();
membershipStore.getMembership();
// const membersStore = useMembersStore();


const { membership } = storeToRefs(membershipStore);
// const { members, membersLoadingError } = storeToRefs(membersStore);


function updateMembership(membership: Member) {
  membershipStore.updateMembership(membership);
}
</script>

<template>
  <div>
    <div v-if="membership === null" class="loading">
      <h2>{{ $t("Loading members") }}</h2>
    </div>
    <div v-else class="members-table">
      <MembershipTable
        :membership="membership"
        @update:member="updateMembership($event)"
      />
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
