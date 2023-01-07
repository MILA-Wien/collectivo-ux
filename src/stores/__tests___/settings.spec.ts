import { setActivePinia, createPinia } from "pinia";
import { useSettingsStore } from "../settings";
import { it, describe, expect, beforeEach } from "vitest";

describe("Settings Store", () => {
    beforeEach(() => {
      // creates a fresh pinia and make it active so it's automatically picked
      // up by any useStore() call without having to pass it to it:
      // `useStore(pinia)`
      setActivePinia(createPinia());
    });

    it("should have set authentication status", () => {
        const settingsStore = useSettingsStore();
        expect(settingsStore.version).toBeNull;
      });
});