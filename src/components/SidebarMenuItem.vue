<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const userStore = useUserStore();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const item_ = JSON.parse(JSON.stringify(props.item));
const icon = "pi pi-fw " + (props.item.icon_name ? item_.icon_name : "");
if (item_.extension.name === "core" && item_.name === "logout") {
  item_.target = "link";
  item_.link = userStore.user?.logoutUrl || "/";
}
console.log(item_);
</script>

<template>
  <router-link
    v-if="item_.target === 'route'"
    :to="'/' + item_.route"
    :class="{ 'p-disabled': item_.disabled }"
  >
    <div class="flex flex-row py-2 px-3 gap-2 items-center">
      <span class="flex p-menuitem-icon content-center" v-if="icon">
        <i :class="icon"></i>
      </span>

      <span class="pt-1 w-full">{{ t(item_.label) }}</span>

      <span class="grow"></span>
      <span v-if="item_.items" class="flex content-center">
        <i class="pi pi-fw pi-angle-down"></i>
      </span>
    </div>
  </router-link>
  <a
    v-else
    :href="item_.link"
    :class="{ 'p-disabled': item_.disabled }"
    :target="item_.target === 'link_blank' ? '_blank' : ''"
  >
    <div class="flex flex-row py-2 px-3 gap-2 items-center">
      <span class="flex p-menuitem-icon content-center" v-if="icon">
        <i :class="icon"></i>
      </span>

      <span class="pt-1 w-full">{{ t(item_.label) }}</span>

      <span class="grow"></span>
      <span v-if="item_.items > 0" class="flex content-center">
        <i class="pi pi-fw pi-angle-down"></i>
      </span>
    </div>
  </a>
</template>

<style lang="scss"></style>
