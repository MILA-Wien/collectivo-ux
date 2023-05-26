import { coreVersionFn } from "@/api/api";
import type { Version } from "@/api/types";
import { defineStore } from "pinia";
export type SettingsStoreState = {
  version: Version | null;
  extensions: any;
  remoteIDs: any;
};

export const useSettingsStore = defineStore({
  id: "settings",
  state: () => {
    return {
      version: null,
      remoteIDs: {},
    } as SettingsStoreState;
  },

  actions: {
    async getVersion() {
      this.version = await coreVersionFn();
    },
    getRemoteID(component: any) {
      // Get URL from component
      const url = component.path;

      // Return remote ID if already set
      if (url in this.remoteIDs) {
        return this.remoteIDs[url];
      }

      // Create window.RemoteURLs if not exists
      // @ts-ignore
      if (window.RemoteURLs === undefined) {
        // @ts-ignore
        window.RemoteURLs = {
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
          e: undefined,
          f: undefined,
          g: undefined,
          h: undefined,
          i: undefined,
          j: undefined,
          k: undefined,
          l: undefined,
          m: undefined,
          n: undefined,
          o: undefined,
          p: undefined,
          q: undefined,
        };
      }

      // Get new remote ID from window.RemoteURLs
      // @ts-ignore
      const remoteID = Object.keys(window.RemoteURLs).find(
        // @ts-ignore
        (key) => window.RemoteURLs[key] === undefined
      );

      // Throw error if all remote IDs are taken
      if (remoteID === undefined) {
        throw new Error("No free slot for remote url");
      }

      // Set remote ID to window and store and return it
      // @ts-ignore
      window.RemoteURLs[remoteID] = url;
      this.remoteIDs[url] = remoteID;
      return remoteID;
    },
  },
});
