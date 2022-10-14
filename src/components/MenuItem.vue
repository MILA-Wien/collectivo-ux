<script setup lang="ts">
import { useMenuStore } from "@/stores/menu";
const store = useMenuStore();
store.getMenu();
// const dict = store.menu[0];
// console.log(dict)
</script>

<template>
  <div class="s">
    <div class="s__menu">
      <span v-if="store.menu" class="s__menu__text">
        <li v-for="dict in Object.values(store.menu)">
            <li v-for="value, key in Object(dict)">
                {{ key +' '+  value }}
            </li>
    </li>
        Menu: {{ store.menu }}
        </span>
      <span v-else class="s__menu__text">Loading...</span>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}
</style>
