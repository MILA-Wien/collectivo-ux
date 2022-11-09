import { defineStore } from "pinia";
import { coreMenuItemsFn } from "@/api/api";
import type { ExtensionMenu, ExtensionMenuItem } from "@/api/types";

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
      if (this.menu === null) {
        this.menu = {} as ExtensionMenu;
      }
      this.menu.menu = await coreMenuItemsFn();
    },
  },
  getters: {
    menugetter: (state) => {
      state.menu;
    },
    getMenuItem: (state) => {
      return (extension: string, component: string) => {
        return state.menu?.menu.find(
          (item: ExtensionMenuItem) =>
            (item.extension === extension && item.component_name === component) ||
            (item.extension === extension && item.item_id === component)
        );
      };
    },
  },
});
