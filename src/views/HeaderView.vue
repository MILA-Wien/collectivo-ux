<template>
  <header class="flex items-center justify-between px-6 pt-7 lg:pt-10">
    <div class="flex items-bottom">
      <div class="lg:hidden mr-5">
        <Button
          @click="isOpen = true"
          icon="pi pi-align-left"
          class="p-button-outline"
          id="toggle-sidebar-button"
        />
      </div>
      <h1>{{ t(title.title.value) }}</h1>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSidebar } from "../hooks/useSidebar";

import { useRoute } from "vue-router";
import Button from "primevue/button";
import { useMenuStore } from "@/stores/menu";
import { useI18n } from "vue-i18n";

import { useTitle } from "../hooks/useTitle";

const { t } = useI18n();
const route = useRoute();
const { isOpen } = useSidebar();
const menuStore = useMenuStore();
const title = useTitle();
</script>
