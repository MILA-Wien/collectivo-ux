<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const icon = "pi pi-fw " + (props.item.icon_name ? props.item.icon_name : "");
if (props.item.extension.name === "core" && props.item.component === "logout") {
  props.item.link = userStore.user?.logoutUrl || "/";
}
if (props.item.items.length == 0) {
  // delete props.items.length
  props.item.items = undefined;
}
</script>

<template>
  <router-link
    v-if="item.target === 'route'"
    :to="'/' + item.route"
    :class="{ 'p-disabled': item.disabled }"
  >
    <div class="flex flex-row py-2 px-3 gap-2 items-center">
      <span class="flex p-menuitem-icon content-center" v-if="icon">
        <i :class="icon"></i>
      </span>

      <span class="pt-1 w-full">{{ item.label }}</span>

      <span class="grow"></span>
      <span v-if="item.items" class="flex content-center">
        <i class="pi pi-fw pi-angle-down"></i>
      </span>
    </div>
  </router-link>
  <a
    v-else
    :href="item.url"
    :class="{ 'p-disabled': item.disabled }"
    :target="item.target === 'link_blank' ? '_blank' : ''"
  >
    <div class="flex flex-row py-2 px-3 gap-2 items-center">
      <span class="flex p-menuitem-icon content-center" v-if="icon">
        <i :class="icon"></i>
      </span>

      <span class="pt-1 w-full">{{ item.label }}</span>

      <span class="grow"></span>
      <span v-if="item.items > 0" class="flex content-center">
        <i class="pi pi-fw pi-angle-down"></i>
      </span>
    </div>
  </a>
</template>

<style lang="scss"></style>
