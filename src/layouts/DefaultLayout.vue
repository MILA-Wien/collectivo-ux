<script setup lang="ts">
import { RouterView } from "vue-router";
import HeaderView from "@/views/HeaderView.vue";
</script>

<template>
  <div
    id="collectivo-main"
    class="flex-1 flex flex-col overflow-hidden default-layout"
  >
    <slot name="header">
      <HeaderView />
    </slot>
    <main class="flex-1 overflow-x-hidden overflow-y-auto">
      <div class="mx-auto px-10 pb-10 pt-5 h-full">
        <slot name="main">
          <RouterView />
        </slot>
      </div>
    </main>
  </div>
</template>
