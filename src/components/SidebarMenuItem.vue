<script lang="ts" setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <router-link
    v-if="item.to"
    :to="item.to"
    :class="{ 'p-disabled': item.disabled }"
  >
    <div class="flex flex-row py-2 px-3 gap-2 items-center">
      <span class="flex p-menuitem-icon content-center" v-if="item.icon">
        <i :class="item.icon"></i>
      </span>

      <span class="pt-1 w-full">{{ item.label }}</span>

      <span class="grow"></span>
      <span v-if="item.items" class="flex content-center">
        <i class="pi pi-fw pi-angle-down"></i>
      </span>
    </div>
  </router-link>
  <router-link
    v-else-if="item.target == 'iframe'"
    :to="item.to"
    :class="{ 'p-disabled': item.disabled }"
  >
    <div class="flex flex-row py-2 px-3 gap-2 items-center">
      <span class="flex p-menuitem-icon content-center" v-if="item.icon">
        <i :class="item.icon"></i>
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
    target="_blank"
  >
    <div class="flex flex-row py-2 px-3 gap-2 items-center">
      <span class="flex p-menuitem-icon content-center" v-if="item.icon">
        <i :class="item.icon"></i>
      </span>

      <span class="pt-1 w-full">{{ item.label }}</span>

      <span class="grow"></span>
      <span v-if="item.items" class="flex content-center">
        <i class="pi pi-fw pi-angle-down"></i>
      </span>
    </div>
  </a>
</template>

<style lang="scss"></style>
