<template>
  <div class="calculation"></div>
</template>
<script setup lang="ts">
import { useFormViewerStore } from "@/stores/formviewer";
import { create, all } from "mathjs";
import { defineProps, defineEmits, ref, watch } from "vue";
import { storeToRefs } from "pinia";
const props = defineProps<{
  element: any;
}>();
const emit = defineEmits(["change", "update"]);
const config = {};
let formula = ref(props.element.properties.content);
let math = create(all, config);
let result = 0;
const formViewerStore = useFormViewerStore();
const { values } = storeToRefs(formViewerStore);

function updateResult() {
  let oldResult = result;
  let newResult: number | undefined = 0;
  try {
    newResult = math.evaluate(formula.value, values.value);

    if (oldResult != newResult && newResult != undefined) {
      result = newResult;
      emit("update", result);
    }
  } catch (e) {
    newResult = undefined;
  }
}
watch(() => values.value, updateResult);
</script>
