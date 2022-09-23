import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { test, expect } from "vitest";
import AboutView from "../AboutView.vue";

test("mount component", async () => {
  expect(AboutView).toBeTruthy();

  const wrapper = mount(AboutView, {
    global: {
      plugins: [createPinia()], // initializes Pinia
      stubs: { AboutView },
    },
  });

  expect(wrapper.text()).toContain("3");
  expect(wrapper.html()).toMatchSnapshot();

  await wrapper.get("button").trigger("click");

  expect(wrapper.text()).toContain("4");

  await wrapper.get("button").trigger("click");

  expect(wrapper.text()).toContain("5");
});
