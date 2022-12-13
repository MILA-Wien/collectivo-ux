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
      <label class="font-light">{{ o }}</label>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { useFormViewerStore } from "@/stores/formviewer";
const props = defineProps<{
  element: any;
}>();
const valueFromStore = useFormViewerStore().getValueForId(props.element.properties.extId);
const emit = defineEmits(["change"]);
const values = ref(props.element.properties.values.map(() => false));
if (!valueFromStore) {
  props.element.properties.options.forEach((o: string) => (values.value[o] = false));
} else {
  values.value = valueFromStore;
}

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
