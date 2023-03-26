import { API } from "@/api/api";
import type { ExtensionMenu, ExtensionMenuItem } from "@/api/types";
import { defineStore } from "pinia";

export type MenuStoreState = {
  mainMenu: ExtensionMenu;
  adminMenu: ExtensionMenu;
  sideBarOpen: boolean;
  title: string;
};

export const useMenuStore = defineStore({
  id: "menu",
  state: () =>
    ({
      mainMenu: { menu: [], loaded: false } as ExtensionMenu,
      adminMenu: { menu: [], loaded: false } as ExtensionMenu,
      sideBarOpen: false,
      title: "",
    } as MenuStoreState),

  actions: {
    async getMenus() {
      const [mainMenu, adminMenu] = await Promise.all([
        API.get("menusMenusMain"),
        API.get("menusMenusAdmin"),
      ]);
      this.mainMenu.menu = mainMenu.data.items;
      this.mainMenu.loaded = true;
      this.adminMenu.menu = adminMenu.data.items;
      this.adminMenu.loaded = true;
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
      state.mainMenu;
    },
    getSideBarOpen: (state) => {
      return state.sideBarOpen;
    },
    getTitle: (state) => {
      return state.title;
    },
    getMenuItem: (state) => {
      return (extension: string, component: string) => {
        return state.mainMenu?.menu?.find(
          (item: ExtensionMenuItem) =>
            (item.extension === extension &&
              item.component_name === component) ||
            (item.extension === extension && item.item_id === component)
        );
      };
    },
  },
});
