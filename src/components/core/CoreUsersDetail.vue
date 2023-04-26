<script setup lang="ts">
import ObjectDetailNew from "@/components/datatable/ObjectDetailNew.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import MasonryWall from "@yeger/vue-masonry-wall";
import { useI18n } from "vue-i18n";
import { ref, onMounted, onUpdated } from "vue";
// import flexmasonry
import FlexMasonry from "flexmasonry/src/flexmasonry";

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
onMounted(() => {
  FlexMasonry.init(".gridss", {
    responsive: true,
    numCols: 2,
    breakpointCols: {
      "min-width: 1500px": 3,
      "min-width: 1200px": 2,
      "min-width: 768px": 2,
      "min-width: 576px": 1,
    },
  });
});
// console.log(FlexMasonry.init);
</script>

<template>
  <div class="w-full h-full">
    <div class="gridss">
      <div v-for="item in profile_endpoints" class="item">
        <ObjectDetailNew
          :store="membersStore"
          :name="item"
          :id="$route.params.id"
        >
        </ObjectDetailNew>
      </div>
    </div>
  </div>
  <!-- <div id="collectivo-users-detail">
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
  </div> -->
</template>

<style lang="scss">
@import "flexmasonry/src/flexmasonry";
.item {
  background-color: aqua;
}
</style>
