<script setup lang="ts">
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";
import ObjectMasonry from "@/components/datatable/ObjectMasonry.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import type { endpoints } from "@/api/api";

const menuStore = useMenuStore();
const membersStore = useMembersStore();
menuStore.setTitle("User");
// TODO: Load username from store
// TODO: Add memberships and tags
// TODO: Make profile list dynamic (based on extensions)
const profile_endpoints: Array<keyof typeof endpoints> = [
  "coreUsers",
  "profilesProfiles",
  "paymentsProfiles",
  "milaProfiles",
];
</script>

<template>
  <ObjectMasonry :items="profile_endpoints">
    <template #item="{ item }">
      <ObjectDetail :store="membersStore" :name="item" :id="$route.params.id">
      </ObjectDetail>
    </template>
  </ObjectMasonry>
</template>
