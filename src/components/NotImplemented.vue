<script setup lang="ts">
import { useMenuStore } from "@/stores/menu";
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';
const { t } = useI18n();
const menuStore = useMenuStore();
menuStore.setTitle(t("Not yet implemented."));
const route = useRoute();
</script>

<template>
  {{ t("This extension is still being developed.") }}<br/>
  {{ t("Please check back later.") }}<br/>
  <br/>
  {{ t("If you think this is wrong please send an email with the follwing string:") }}<br />
  <br/>
  <b>{{ route.path }}
  </b>
</template>
