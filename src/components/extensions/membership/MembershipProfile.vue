<script setup lang="ts">
import { useMembershipStore } from "@/stores/membership";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";
import MembershipProfileDetail from "./MembershipProfileDetail.vue";

const menuStore = useMenuStore();
menuStore.setTitle("Membership");

const membershipStore = useMembershipStore();
membershipStore.getMembershipSchema();
membershipStore.getMembership();
const { membership, membershipSchema } = storeToRefs(membershipStore);
</script>

<template>
  <div class="members-wrapper">
    <div
      v-if="membership === null || membershipSchema === null"
      class="loading"
    >
      <h2>{{ $t("Loading membership data") }}</h2>
    </div>
    <div v-else class="members-table">
      <MembershipProfileDetail
        :membership="membership"
        :membershipSchema="membershipSchema"
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
