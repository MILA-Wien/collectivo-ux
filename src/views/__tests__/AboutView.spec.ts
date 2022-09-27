import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { test, expect } from "vitest";
import AboutView from "../AboutView.vue";
import { setupI18n, loadLocaleMessages } from "@/locales/i18n";

test("mount component", async () => {
  expect(AboutView).toBeTruthy();
  const i18n = setupI18n();
  const wrapper = mount(AboutView, {
    global: {
      plugins: [createPinia(), i18n], // initializes Pinia
      stubs: { AboutView },
    },
  });
  loadLocaleMessages(i18n, "en");

  expect(wrapper.text()).toContain("3");
  expect(wrapper.html()).toMatchSnapshot();

  await wrapper.get("button").trigger("click");

  expect(wrapper.text()).toContain("4");

  await wrapper.get("button").trigger("click");

  expect(wrapper.text()).toContain("5");
});
