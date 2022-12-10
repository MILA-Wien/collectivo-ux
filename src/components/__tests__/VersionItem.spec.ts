import { test, expect } from "vitest";
import { createPinia } from "pinia";

import { mount } from "@vue/test-utils";
import VersionItem from "../VersionItem.vue";

test("Version Item", async () => {
  expect(VersionItem).toBeTruthy();

});
