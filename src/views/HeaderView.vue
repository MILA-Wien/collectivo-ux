<template>
  <header
    class="flex items-center justify-between px-6 py-4"
  >
    <div class="flex items-center">
      <div class="lg:hidden">
        <Button
          @click="isOpen = true"
          icon="pi pi-align-left"
          class="p-button-text"
        />
    </div>
  </div>
  </header>
</template>

<script setup lang="ts">
import { useSidebar } from "../hooks/useSidebar";
import Button from 'primevue/button';
const { isOpen } = useSidebar();
</script>
