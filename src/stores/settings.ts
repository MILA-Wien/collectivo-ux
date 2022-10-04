import { defineStore } from "pinia";
import { versionFn } from "@/api/api";
import type { Version } from "@/api/types";

export type SettingsStoreState = {
  version: Version | null;
};

export const useSettingsStore = defineStore({
  id: "settings",
  state: () =>
    ({
      version: null,
    } as SettingsStoreState),

  actions: {
    async getVersion() {
      this.version = await versionFn();
    },
  },
  getters: {},
});
