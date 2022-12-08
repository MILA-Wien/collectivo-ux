<script setup lang="ts">
import VersionItem from "../components/VersionItem.vue";
import { useDashboardStore } from "@/stores/dashboard";
import { storeToRefs } from "pinia";
import type { DashboardTile } from "@/api/types";
import { useI18n } from "vue-i18n";
import { defineAsyncComponent, watch } from "vue";
import LoadingItem from "@/components/LoadingItem.vue";
import PrimeCard from "primevue/card";
import { useTitle } from "../hooks/useTitle";
import { useUserStore } from "@/stores/user";

const title = useTitle();
title.title.value = "Dashboard";
const userStore = useUserStore();
// language
const { t } = useI18n();
// store
const dashboardStore = useDashboardStore();
dashboardStore.getDashboardTiles();
const { tiles } = storeToRefs(dashboardStore);
let tileComponents: Record<string, any> = {};

function getComponentForTile(tile: DashboardTile) {
  if (tileComponents[tile.tile_id]) {
    return tileComponents[tile.tile_id];
  } else {
    tileComponents[tile.tile_id] = LoadingItem;
    const component = defineAsyncComponent(
      () => import(`../extensions/${tile.extension}_${tile.component_name}.ts`)
    );
    tileComponents[tile.tile_id] = component;
    return component;
  }
}
watch(
  tiles,
  (tiles) => {
    if (tiles?.results)
      tiles?.results.forEach((tile) => {
        getComponentForTile(tile);
      });
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <!-- <h1>{{ t("Dashboard") }}</h1> -->
    <span class="w-full">
      Hallo,
      {{ userStore.user?.tokenParsed.given_name }}
      {{ userStore.user?.tokenParsed.family_name }}. Willkommen auf der MILA
      Mitgliederplattform! Bei Fragen wende dich bitte an
      <a href="mailto:mitmachen@mila.wien">mitmachen@mila.wien</a>.
    </span>
    <div class="grid">
      <div
        v-for="tile in tiles?.results"
        :key="tile.tile_id"
        class="p-4 bg-white rounded-lg shadow md:col-6 lg:col-4"
      >
        <PrimeCard>
          <template #title>
            {{ t(tile.label ? tile.label : "") }}
          </template>
          <template #content>
            <component
              :is="tileComponents[tile.tile_id]"
              :tile="tile"
            ></component>
          </template>
        </PrimeCard>
      </div>
    </div>
    <!-- <VersionItem /> -->
  </div>
</template>
