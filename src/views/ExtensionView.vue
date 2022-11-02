<script setup lang="ts">
import { useRoute } from "vue-router";
import { shallowRef, watch } from "vue";
import LoadingItem from "../components/LoadingItem.vue";
import ErrorItem from "../components/ErrorItem.vue";

const route = useRoute();

let type = shallowRef(LoadingItem);

// const name = extensionName.value;
const name = "../extensions/" + route.params.extension;
import(name)
  .then((module) => {
    type.value = module.default;
  })
  .catch((error) => {
    console.error("blub", error);
    type.value = ErrorItem;
  });

watch(
  () => route.params.extension,
  () => {
    type.value = LoadingItem;
    const name = "../extensions/" + route.params.extension;
    import(name)
      .then((module) => {
        type.value = module.default;
      })
      .catch(() => {
        type.value = ErrorItem;
      });
  }
);
</script>

<template>
  <div>
    <h1>{{ route.params.extension }}</h1>
    <p>{{ route.params.item }}</p>
    <component :is="type"></component>
  </div>
</template>
