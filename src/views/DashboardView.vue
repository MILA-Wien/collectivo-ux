<script setup lang="ts">
import type { DashboardTile } from "@/api/types";
import LoadingItem from "@/components/LoadingItem.vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useMenuStore } from "@/stores/menu";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import PrimeCard from "primevue/card";
import { defineAsyncComponent, watch } from "vue";
import { useI18n } from "vue-i18n";

const menuStore = useMenuStore();
menuStore.setTitle("Dashboard");
const userStore = useUserStore();
// language
const { t } = useI18n();
// store
const dashboardStore = useDashboardStore();
dashboardStore.getDashboardTiles();
const { tiles } = storeToRefs(dashboardStore);
let tileComponents: Record<string, any> = {};

function getComponentForTile(tile: DashboardTile) {
  if (tileComponents[tile.id]) {
    return tileComponents[tile.id];
  } else {
    tileComponents[tile.id] = LoadingItem;
    if (!tile.extension_name || !tile.component) return LoadingItem;
    const component = defineAsyncComponent(
      () => import(`../extensions/${tile.extension_name}/${tile.component}.ts`)
    );
    tileComponents[tile.id] = component;
    return component;
  }
}
watch(
  tiles,
  (tiles) => {
    if (tiles?.results && tiles.results.length >= 0)
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
    <span class="w-full" id="welcome-member-span">
      {{
        `${t("Hello,")} ${userStore.user?.tokenParsed.given_name}
      ${userStore.user?.tokenParsed.family_name}. ${t(
          "Willkommen auf der MILA Mitgliederplattform! Bei Fragen wende dich bitte an"
        )}`
      }}
      <a href="mailto:mitmachen@mila.wien">mitmachen@mila.wien</a>.
    </span>
    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:md:grid-cols-3 gap-4 mt-8"
      v-if="tiles?.results?.length > 0"
    >
      <div
        v-for="tile in tiles?.results"
        :key="tile.id"
        class="md:col-6 lg:col-4"
      >
        <PrimeCard>
          <template #title>
            {{ t(tile.label ? tile.label : "") }}
          </template>
          <template #content>
            <component :is="tileComponents[tile.id]" :tile="tile"></component>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.p-card .p-card-content {
  padding: 0;
}
</style>
