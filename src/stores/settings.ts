import { defineStore } from "pinia";
import { coreVersionFn } from "@/api/api";
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
      this.version = await coreVersionFn();
    },
    async getExtensions() {
      // Todo: get this from the API
      // @ts-ignore
      window.RemoteURLs = {
        a: import.meta.env.VITE_REMOTE_URL_A
          ? import.meta.env.VITE_REMOTE_URL_A
          : undefined,
        b: import.meta.env.VITE_REMOTE_URL_B
          ? import.meta.env.VITE_REMOTE_URL_B
          : undefined,
        c: import.meta.env.VITE_REMOTE_URL_C
          ? import.meta.env.VITE_REMOTE_URL_C
          : undefined,
        d: import.meta.env.VITE_REMOTE_URL_D
          ? import.meta.env.VITE_REMOTE_URL_D
          : undefined,
        e: import.meta.env.VITE_REMOTE_URL_E
          ? import.meta.env.VITE_REMOTE_URL_E
          : undefined,
        f: import.meta.env.VITE_REMOTE_URL_F
          ? import.meta.env.VITE_REMOTE_URL_F
          : undefined,
        g: import.meta.env.VITE_REMOTE_URL_G
          ? import.meta.env.VITE_REMOTE_URL_G
          : undefined,
        h: import.meta.env.VITE_REMOTE_URL_H
          ? import.meta.env.VITE_REMOTE_URL_H
          : undefined,
      };
    },
  },
  getters: {},
});
