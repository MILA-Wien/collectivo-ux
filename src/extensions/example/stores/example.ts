import { defineStore } from "pinia";

export type ExampleStore = {
  storeEntry: number;
};

export const useExampleStore = defineStore({
  id: "example",
  state: () =>
    ({
      storeEntry: 1,
    } as ExampleStore),
  actions: {
    async increaseEntry() {
      this.storeEntry++;
    },
  },
  getters: {},
});
