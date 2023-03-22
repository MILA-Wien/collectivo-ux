<script setup lang="ts">
import { useMenuStore } from "@/stores/menu";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const menuStore = useMenuStore();
menuStore.setTitle("Undefined");
</script>

<template>
  {{ t("Not yet implemented.") }}
</template>
