import { test, expect } from "vitest";
import { createPinia } from "pinia";

import { mount } from "@vue/test-utils";
import VersionItem from "../VersionItem.vue";

test("Version Item", async () => {
  expect(VersionItem).toBeTruthy();

  const wrapper = mount(VersionItem, {
    props: {
      count: 4,
    },
    global: {
      plugins: [createPinia()], // initializes Pinia
      stubs: { VersionItem },
    },
  });

  expect(wrapper.text()).toContain("Loading...");
});
