<script setup lang="ts">
import { RouterView } from "vue-router";
import { storeToRefs } from "pinia";
import MenuView from "./views/MenuView.vue";
import HeaderView from "./views/HeaderView.vue";
import { useUserStore } from "./stores/user";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<template>
  <div class="flex h-screen bg-gray-100 font-roboto" v-if="user?.authenticated">
    <MenuView />
    <div class="flex-1 flex flex-col overflow-hidden">
      <HeaderView />
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container mr-auto px-6 py-4">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
