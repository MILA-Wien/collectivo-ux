<template>
  <div class="about">
    <h1>This is an about page</h1>
    <br />
    <div>Counter: {{ store.count }}</div>
    <button @click="increment">Increment</button>
  </div>
</template>
<script setup lang="ts">



import { useCounterStore } from "@/stores/counter";
const store = useCounterStore();
store.count++;
// with autocompletion ✨
store.$patch({ count: store.count + 1 });
// or using an action instead
store.increment();
const increment = () => {
  store.$patch({ count: store.count + 1 });
};

</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
