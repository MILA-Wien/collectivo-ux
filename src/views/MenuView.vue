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
      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition
      duration-300 mr-5 transform bg-white lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex flex-col items-center">
        <img src="../assets/mila_logo_header.png" alt="MILA Logo" class="p-4">
        <MenuMain />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSidebar } from "../hooks/useSidebar";
import MenuMain from "../components/MenuMain.vue"
const { isOpen } = useSidebar();
</script>
