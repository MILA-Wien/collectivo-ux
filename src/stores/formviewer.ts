import { defineStore } from "pinia";
import type { RootElement } from "@/formviewer/types/elements";
import { API, endpoints } from "@/api/api";

interface Values {
  [key: string]: string;
}

export type FormViewStoreState = {
  tree: RootElement | null;
  currentPage: String | null | undefined;
  values: Values;
  path: Array<String>;
  faults: Array<String>;
  validateCurrentPage: boolean;
};

export const useFormViewerStore = defineStore({
  id: "formviewer",
  state: () =>
    ({
      tree: null,
      currentPage: null,
      path: [],
      values: {},
      faults: [],
      validateCurrentPage: false,
    } as FormViewStoreState),
  actions: {
    setTree(tree: RootElement) {
      this.tree = tree;
    },
    setCurrentPage(page: String) {
      this.currentPage = page;
      this.path.push(page);
    },
    updateValue(id: string, value: any) {
      this.values[id] = value;
      this.validateCurrentPage = false;
    },
    nextPage() {
      this.validateCurrentPage = false;
      const index = this.tree?.children?.findIndex(
        (e) => e.id == this.currentPage
      );

      if (index == -1 || typeof index === "undefined") return;
      if (this.tree?.children && index + 1 < this.tree.children.length) {
        this.currentPage = this.tree?.children[index + 1].id;
        this.path.push(this.currentPage);
      }
    },
    previousPage() {
      if (this.path.length > 1) {
        this.path.pop();
        this.currentPage = this.path[this.path.length - 1];
        this.validateCurrentPage = false;
      }
    },
    goToPage(page: string) {
      this.validateCurrentPage = false;
      this.currentPage = page;
    },
    validatePage() {
      this.validateCurrentPage = true;
    },
    async loadOptions(id: string, endpoint: string) {
      const endpointKey = (
        Object.keys(endpoints) as (keyof typeof endpoints)[]
      ).find((key) => {
        return endpoints[key] === endpoint;
      });
      if (endpointKey) {
        const result = API.get(endpointKey);
        return result;
      }
    },
  },
  getters: {
    getTree: (state) => {
      return state.tree;
    },
    validationFaults: (state) => {
      return state.faults;
    },
    getValueForId: (state) => (id: string) => {
      return state.values[id];
    },
    getCurrentPage: (state) => {
      return state.currentPage;
    },
    getValidateCurrentPage: (state) => {
      return state.validateCurrentPage;
    },
  },
});
