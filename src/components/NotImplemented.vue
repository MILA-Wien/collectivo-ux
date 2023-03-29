<script setup lang="ts">
import { useMenuStore } from "@/stores/menu";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const menuStore = useMenuStore();
menuStore.setTitle(t("Not yet implemented."));
</script>

<template>
  {{ t("This extension is still being developed.") }}
</template>
