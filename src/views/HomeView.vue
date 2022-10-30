<script setup lang="ts">
import TheWelcome from "@/components/TheWelcome.vue";
import { useUserStore } from "@/stores/user";
const user = useUserStore();
</script>

<template>
  <main>
    <TheWelcome v-if="user.user!.authenticated" />
  </main>
</template>
