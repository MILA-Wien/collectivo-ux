import { defineStore } from "pinia";
import { coreMenuFn } from "@/api/api";
import type { Menu } from "@/api/types";

export type MenuStoreState = {
  menu: Menu | null;
};

export const useMenuStore = defineStore({
  id: "menu",
  state: () =>
    ({
      menu: null,
    } as MenuStoreState),

  actions: {
    async getMenu() {
      this.menu = await coreMenuFn();
    },
  },
  getters: {
  },
});
