import { defineStore } from "pinia";
import { coreMicroFrontendsFn } from "@/api/api";
import type { MicroFrontendJson } from "@/api/types";

export type MicroFrontendStoreState = {
    microfrontend: MicroFrontendJson | null;
};

export const useMicroFrontendStore = defineStore({
  id: "microfrontend",
  state: () =>
    ({
        microfrontend: null,
    } as MicroFrontendStoreState),

  actions: {
    async getMicroFrontend(name:string) {
      this.microfrontend = await coreMicroFrontendsFn(name);
    },
  },
  getters: {
    microfrontendgetter : (state) => {microfrontend:state.microfrontend},
  },
});
