<template>
  <div class="calculation" v-if="!element.hidden">
    <div class="calculation-label">{{ element.properties.label }}</div>
    <div class="calculation-result">
      {{ result }} {{ element.properties.description }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFormViewerStore } from "@/stores/formviewer";
import { create, all } from "mathjs";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
const props = defineProps<{
  element: any;
}>();
const config = {};
let formula = ref(props.element.properties.content);
let math = create(all, config);
let result = ref(0);
const formViewerStore = useFormViewerStore();
const { values } = storeToRefs(formViewerStore);

function updateResult(values: any) {
  let oldResult = result.value;
  let newResult: number | undefined = 0;
  const vals: any = {};
  for (const [key, value] of Object.entries(values)) {
    if (value && typeof value === "string") {
      const n = parseInt(value);
      if (!isNaN(n)) {
        vals[key] = n;
      }
    } else if (value && typeof value === "number") {
      vals[key] = value;
    }
  }
  try {
    newResult = math.evaluate(formula.value, vals);

    if (oldResult != newResult && newResult != undefined) {
      result.value = newResult;
      // emit("update", newResult); //todo: this is not working
    }
  } catch (e) {
    newResult = undefined;
  }
}
updateResult(values.value);
watch(
  () => values.value,
  (_, newVals: any) => {
    updateResult(newVals);
  },
  { deep: true }
);
</script>
<style scoped>
.calculation {
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
}

.calculation-result {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
