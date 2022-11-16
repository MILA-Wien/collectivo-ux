<script setup lang="ts">
import VersionItem from "../components/VersionItem.vue";
import { useDashboardStore } from "@/stores/dashboard";
import { storeToRefs } from "pinia";
import type { DashboardTile } from "@/api/types";
const dashboardStore = useDashboardStore();

dashboardStore.getDashboardTiles();
// console.log(dashboardStore.);
const { tiles } = storeToRefs(dashboardStore);
function getComponentForTile(tile: DashboardTile) {
  import(`../extensions/${tile.extension}/${tile.component_name}.ts`).then(
    (component: any) => {
      console.log(component);
      return component;
    }
  );
}
</script>

<template>
  <div>
    <h1>Version API Call</h1>
    <VersionItem />
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="tile in tiles?.results" :key="tile.tile_id" class="p-4 bg-white rounded-lg shadow">
        {{ tile }}
        <component :is="getComponentForTile(tile)" :tile="tile" />
      </div>
    </div>
  </div>
</template>
