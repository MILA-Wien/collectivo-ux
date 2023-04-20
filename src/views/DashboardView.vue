<script setup lang="ts">
import type { DashboardTile } from "@/api/types";
import LoadingItem from "@/components/LoadingItem.vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useMenuStore } from "@/stores/menu";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import PrimeButton from "primevue/button";
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
    const component = defineAsyncComponent(
      () => import(`../extensions/${tile.extension_name}_${tile.component}.ts`)
    );
    tileComponents[tile.id] = component;
    return component;
  }
}

watch(
  tiles,
  (tiles) => {
    if (tiles?.results)
      tiles?.results.forEach((tile) => {
        if (tile.source === "component") {
          getComponentForTile(tile);
        }
        //
      });
  },
  { immediate: true }
);
</script>

<template>
  <div id="collectivo-dashboard">
    <div class="grid grid-cols-1 md:grid-cols-2 xl:md:grid-cols-3 gap-4">
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
            <component
              v-if="tile.component"
              :is="tileComponents[tile.id]"
              :tile="tile"
            ></component>
            <div v-else>
              <div v-html="tile.content" class="pb-4"></div>
              <div v-for="button in tile.buttons" :key="button.id">
                <div v-if="button.link_type === 'internal'">
                  <RouterLink :to="button.link">
                    <PrimeButton>
                      {{ t(button.label) }}
                    </PrimeButton>
                  </RouterLink>
                </div>
                <div v-else>
                  <a :href="button.link" target="blank">
                    <PrimeButton>
                      {{ t(button.label) }}
                      <span class="pl-3"></span>
                      <i class="pi pi-external-link"></i>
                    </PrimeButton>
                  </a>
                </div>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-card .p-card-content) {
  padding: 0;
}
</style>
