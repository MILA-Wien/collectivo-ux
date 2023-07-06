<!-- The left sidebar of the main interface. -->
<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { version } from "../../package.json";
import MenuMain from "../components/SidebarMenu.vue";
import VersionItem from "../components/VersionItem.vue";
import { useMenuStore } from "../stores/menu";
const mainStore = useMainStore();
const menuStore = useMenuStore();
const { getSideBarOpen } = storeToRefs(menuStore);
const { coreSettings } = storeToRefs(mainStore);
const error = ref<any>(null);
mainStore.getDetail("coreSettings").catch((e: any) => {
  error.value = e;
});
function getLogo() {
  if (coreSettings.value.detail.project_logo) {
    return coreSettings.value.detail.project_logo;
  } else if (coreSettings.value.detail.project_logo_url) {
    return coreSettings.value.detail.project_logo_url;
  }
}
function toggleSideBar() {
  menuStore.setSideBarOpen(getSideBarOpen.value ? false : true);
}
</script>

<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="getSideBarOpen ? 'block' : 'hidden'"
      id="collectivo-backdrop"
      @click="toggleSideBar()"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
    ></div>
    <!-- End Backdrop -->

    <div
      :class="
        getSideBarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
      "
      class="fixed inset-y-0 left-0 z-30 w-60 overflow-y-auto scrollbar-hide transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0"
      id="collectivo-sidebar"
    >
      <div class="flex flex-col h-full items-center pt-3">
        <div
          v-if="coreSettings.detail.display_project_name"
          class="w-full px-4"
          id="collectivo-sidebar-title"
        >
          <h2 class="break-words mt-0 mb-4">
            {{ coreSettings.detail.project_name }}
          </h2>
        </div>
        <div
          v-if="coreSettings.detail.display_project_description"
          class="w-full px-4 pb-4"
          id="collectivo-sidebar-description"
        >
          <span>
            {{ coreSettings.detail.project_description }}
          </span>
        </div>
        <div
          v-if="coreSettings.detail.display_project_logo"
          class="w-full pb-4 pt-2"
          id="collectivo-sidebar-logo"
        >
          <RouterLink to="/" class="w-full px-4 flex justify-center">
            <img
              v-if="getLogo()"
              :src="getLogo()"
              alt="Project Logo"
              class="w-full"
            />
            <img
              v-else
              src="../assets/collectivo_rgb.png"
              alt="Project Logo"
              class="w-full"
            />
          </RouterLink>
        </div>
        <MenuMain />
        <span class="grow"></span>
        <span class="p-4 text-xs w-full text-gray-800" id="version">
          <a
            href="https://collectivo.io/"
            target="blank"
            class="no-underline"
            style="color: #3b2476"
            >collectivo <VersionItem /> / ux v{{ version }}</a
          >
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
#collectivo-sidebar {
  background-color: #ffffff;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Webkit-based browsers (Chrome, Safari and Opera) */
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
