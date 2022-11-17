<script setup lang="ts">
import { RouterView } from "vue-router";
import { storeToRefs } from "pinia";
import MenuView from "./views/MenuView.vue";
import { useUserStore } from "./stores/user";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<template>
  <div class="app" v-if="user?.token !== ''">
    <header>
      <div class="wrapper">
        <MenuView></MenuView>
      </div>
    </header>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>
<style>
#app {
  width: 100%;
}
</style>

<style scoped>
header {
  position: sticky;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    margin-top: 30px;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>

<style lang="scss">
@import "primeflex/primeflex.scss";
</style>
