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
      class="fixed inset-y-0 left-0 z-30 w-60 overflow-y-auto transition duration-300 mr-5 transform bg-white lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex flex-col h-full items-center">
        <RouterLink to="/" class="w-100 flex justify-center">
          <img
            src="../assets/mila_logo_subline.png"
            alt="MILA Logo"
            class="md:w-2/3 w-1/2 pt-10 pb-4"
          />
        </RouterLink>
        <MenuMain />
        <span class="grow"></span>
        <span class="p-4 text-xs w-full text-gray-800" id="version">
          collectivo <VersionItem/> <br/>
          collectivo-ux v{{ version }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuMain from "../components/MenuMain.vue";
import VersionItem from "../components/VersionItem.vue";
import { useMenuStore } from "../stores/menu";
import { storeToRefs } from "pinia";
import { version } from "../../package.json";
const menuStore = useMenuStore();
const { getSideBarOpen } = storeToRefs(menuStore);
function toggleSideBar() {
  menuStore.setSideBarOpen(getSideBarOpen.value ? false : true);
}
</script>
