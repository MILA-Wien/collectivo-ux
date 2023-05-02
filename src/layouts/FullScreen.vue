<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div
    id="collectivo-main"
    class="flex-1 flex flex-col overflow-hidden fullscreen-layout"
  >
    <main class="flex-1 overflow-x-hidden overflow-y-auto">
      <div class="mx-auto h-full">
        <slot name="main">
          <RouterView />
        </slot>
      </div>
    </main>
  </div>
</template>
