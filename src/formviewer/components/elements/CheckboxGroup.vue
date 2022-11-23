<template>
  <div class="radio-group">
    <div
      v-for="(o, j) in props.element.properties.options"
      v-bind:key="props.element.properties.label + String(j)"
    >
      <input
        type="checkbox"
        class="mr-2"
        @change="toggleValue(j)"
        v-model="values[j]"
        :value="props.element.properties.values[j]"
        :name="props.element.id + j"
      />
      <label>{{ o }}</label>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
const props = defineProps<{
  element: any;
}>();
const emit = defineEmits(["change"]);
const values = ref(props.element.properties.values.map(() => false));
props.element.properties.options.forEach(
  (o: string) => (values.value[o] = false)
);
function toggleValue(v: number) {
  if (values.value[v] == undefined) values[v] = true;
  else values[v] != values[v];
  emit("change", values);
}
</script>

<script lang="ts">
export default {
  name: "ElementCheckboxGroup",
};
</script>
