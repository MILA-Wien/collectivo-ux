<script setup lang="ts">
import ObjectDetailNew from "@/components/datatable/ObjectDetailNew.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import type { endpoints } from "@/api/api";
import { useI18n } from "vue-i18n";
import { VueFlexWaterfall } from "vue-flex-waterfall";
const { t } = useI18n();
const menuStore = useMenuStore();
const membersStore = useMembersStore();
menuStore.setTitle("User");
// TODO: Load username from store
// TODO: Add memberships and tags
// TODO: Make profile list dynamic
const profile_endpoints: Array<keyof typeof endpoints> = [
  "coreUsers",
  "profilesProfiles",
  "paymentsProfiles",
  "milaProfiles",
];
</script>

<template>
  <VueFlexWaterfall
    align-content="stretch"
    class="w-full"
    col="3"
    col-spacing="18px"
    :break-at="{ 1536: 2, 768: 1 }"
  >
    <div v-for="item in profile_endpoints" class="waterfall-item mb-5">
      <ObjectDetailNew
        :store="membersStore"
        :name="item"
        :id="$route.params.id"
      >
      </ObjectDetailNew>
    </div>
  </VueFlexWaterfall>
</template>

<style lang="scss">
.waterfall-item {
  width: 100%;
  @media screen and (min-width: 768px) {
    width: calc(50% - 9px);
  }
  @media screen and (min-width: 1536px) {
    width: calc(33.333% - 6px);
  }
}
</style>
