import { defineStore } from "pinia";
import { coreMenuFn } from "@/api/api";
import type { ExtensionMenu } from "@/api/types";

export type MenuStoreState = {
  menu: ExtensionMenu | null;
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
    menugetter : (state) => {menu:state.menu},
  },
});
