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
  <div class="flex h-screen bg-mila font-sans" v-if="user?.authenticated">
    <MenuView />
    <div class="flex-1 flex flex-col overflow-hidden">
      <HeaderView />
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <div class="mx-auto px-6 py-4">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.bg-mila {
  background-color: #f6f0e7;
}
</style>
<style lang="scss">
.p-button {
  background-color: #2db3a5;
  border-color: #2db3a5;
}

.p-datatable.p-component {
  font-size: 14px;
}

.p-datatable.p-datatable-gridlines .p-datatable-tbody > tr > td,
.p-datatable.p-datatable-gridlines .p-datatable-thead > tr > th {
  padding: 5px 10px 5px 10px;
}

.p-datatable.p-datatable-gridlines .p-datatable-tbody > tr > td {
  vertical-align: middle;
  white-space: normal;
}

.p-checkbox.p-component {
  display: flex;
}
</style>
