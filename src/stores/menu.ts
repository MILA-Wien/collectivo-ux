import { defineStore } from "pinia";
import { coreMenuItemsFn } from "@/api/api";
import type { ExtensionMenu, ExtensionMenuItem } from "@/api/types";

export type MenuStoreState = {
  menu: ExtensionMenu | null;
  menuLoaded: boolean;
  sideBarOpen: boolean;
  title: string;
};

export const useMenuStore = defineStore({
  id: "menu",
  state: () =>
    ({
      menu: null,
      menuLoaded: false,
      sideBarOpen: false,
      title: "",
    } as MenuStoreState),

  actions: {
    async getMenu() {
      if (this.menu === null) {
        this.menu = {} as ExtensionMenu;
      }
      const data = await coreMenuItemsFn();
      this.menu.menu = data.items;
      this.menuLoaded = true;
    },
    setSideBarOpen(open: boolean) {
      this.sideBarOpen = open;
    },
    setTitle(title: string) {
      this.title = title;
    },
  },
  getters: {
    menugetter: (state) => {
      state.menu;
    },
    getSideBarOpen: (state) => {
      return state.sideBarOpen;
    },
    getTitle: (state) => {
      return state.title;
    },
    getMenuItem: (state) => {
      return (extension: string, component: string) => {
        return state.menu?.menu?.find(
          (item: ExtensionMenuItem) =>
            (item.extension === extension &&
              item.component_name === component) ||
            (item.extension === extension && item.item_id === component)
        );
      };
    },
  },
});
