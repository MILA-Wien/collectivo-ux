<script setup lang="ts">
import type { Member } from "@/api/types";
import { useMembershipStore } from "@/stores/membership";
import { useMembersStore } from "@/stores/members";
import { useSettingsStore } from "@/stores/settings";
const storeVersion = useSettingsStore();
storeVersion.getVersion();
const storemember = useMembersStore();
const store = useMembershipStore();
store.getMembership();


function createMembership(membership: Member) {
  store.createMembership(membership);
}
</script>

<template>
  <div class="greetings">
    <h3>Members</h3>
    {{ storemember.members }}
    <br />
    <h3>Membership</h3>
    {{ store.membership }}
    <h3>Version</h3>
    {{ storeVersion.version }}
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
