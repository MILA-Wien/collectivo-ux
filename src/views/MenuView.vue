<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      @click="isOpen = false"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
    ></div>
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-60 overflow-y-auto transition duration-300 mr-5 transform bg-white lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex flex-col h-full items-center">
        <img
          src="../assets/mila_logo_subline.png"
          alt="MILA Logo"
          class="md:w-2/3 w-1/2 pt-10 pb-4"
        />
        <MenuMain />
        <span class="grow"></span>
        <span class="my-3 text-sm">collectivo — <VersionItem /></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from "../hooks/useSidebar";
import MenuMain from "../components/MenuMain.vue";
import VersionItem from "../components/VersionItem.vue";
const { isOpen } = useSidebar();
</script>
