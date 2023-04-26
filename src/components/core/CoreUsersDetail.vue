<script setup lang="ts">
import ObjectDetailNew from "@/components/datatable/ObjectDetailNew.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import MasonryWall from "@yeger/vue-masonry-wall";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const menuStore = useMenuStore();
const membersStore = useMembersStore();
menuStore.setTitle("User");
const profile_endpoints = [
  "coreUsers",
  "profilesProfiles",
  "paymentsProfiles",
  "milaProfiles",
];
</script>

<template>
  <div id="collectivo-users-detail">
    <MasonryWall
      :items="profile_endpoints"
      :ssr-columns="1"
      :column-width="360"
      :gap="20"
    >
      <template #default="{ item }">
        <ObjectDetailNew
          :store="membersStore"
          :name="item"
          :id="$route.params.id"
        >
        </ObjectDetailNew
      ></template>
    </MasonryWall>
  </div>
</template>
