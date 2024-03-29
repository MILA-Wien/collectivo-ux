<script setup lang="ts">
import type { DashboardTile } from "@/api/types";
import LoadingItem from "@/components/LoadingItem.vue";
import ObjectMasonry from "@/components/datatable/ObjectMasonry.vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";
import PrimeButton from "primevue/button";
import PrimeCard from "primevue/card";
import { defineAsyncComponent, watch } from "vue";
import { useI18n } from "vue-i18n";

const menuStore = useMenuStore();
menuStore.setTitle("Dashboard");
const { t } = useI18n();
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
      () =>
        import(
          `../extensions/${tile.extension_name}/components/${tile.component}.ts`
        )
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
    <ObjectMasonry v-if="tiles?.results" :items="tiles.results">
      <template #item="{ item }">
        <PrimeCard>
          <template #title>
            {{ t(item.label ? item.label : "") }}
          </template>
          <template #content>
            <component
              v-if="item.component"
              :is="tileComponents[item.id]"
              :tile="item"
            ></component>
            <div v-else>
              <div v-html="item.content" class="pb-4"></div>
              <div
                v-for="button in item.buttons"
                :key="button.id"
                class="mb-2 mr-2"
              >
                <div v-if="button.link_type === 'internal' && button.link">
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
      </template>
    </ObjectMasonry>
  </div>
</template>

<style scoped>
:deep(.p-card .p-card-content) {
  padding: 0;
}
</style>
