import { API } from "@/api/api";
import type { ExtensionMenu, ExtensionMenuItem } from "@/api/types";
import { defineStore } from "pinia";
import { useMainStore } from "./main";

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
      mainMenu: {
        menu: [],
        loaded: false,
        label: "Main Menu",
      } as ExtensionMenu,
      adminMenu: {
        menu: [],
        loaded: false,
        label: "Admin Area",
      } as ExtensionMenu,
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
    async setDocumentTitle(title: string) {
      const mainStore = useMainStore();
      if (mainStore.coreSettings.detailLoaded == false) {
        await mainStore.get("coreSettings");
      }
      const project_name = mainStore.coreSettings.detail?.project_name;
      if (
        project_name == undefined ||
        project_name == null ||
        project_name == ""
      ) {
        // @ts-ignore
        document.title = `${window.translate(title)} - Collectivo`;
      } else {
        // @ts-ignore
        document.title = `${window.translate(title)} - ${
          mainStore.coreSettings?.detail?.project_name
        }`;
      }
    },
    setTitle(title: string) {
      this.setDocumentTitle(title);
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
            (item.extension === extension && item.component === component) ||
            (item.extension === extension && item.id === component)
        );
      };
    },
    getMenuItemById: (state) => {
      return (id: string) => {
        let item = state.mainMenu?.menu?.find(
          (item: ExtensionMenuItem) => item.id == id
        );
        if (item == undefined) {
          item = state.adminMenu?.menu?.find(
            (item: ExtensionMenuItem) => item.id == id
          );
        }
        return item;
      };
    },
  },
});
