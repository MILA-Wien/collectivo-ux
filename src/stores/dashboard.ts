import { defineStore } from "pinia";
import type { DashboardTiles } from "@/api/types";
import { dashboardTiles } from "@/api/api";

export type DashboardStoreState = {
  tiles: DashboardTiles | null;
};

export const useDashboardStore = defineStore({
  id: "dashboard",
  state: () =>
    ({
      tiles: <DashboardTiles>{},
    } as DashboardStoreState),

  actions: {
    async getDashboardTiles() {
      if (this.tiles === null) {
        this.tiles = {} as DashboardTiles;
      }
      dashboardTiles().then((tiles) => {
        this.tiles = tiles.data;
      });
    },
  },
  getters: {},
});
