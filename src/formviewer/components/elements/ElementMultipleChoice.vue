<template>
  <div class="multiple-choice">
    <checkbox-group :element="element" v-model="value" />
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, defineAsyncComponent } from "vue";
import { useFormViewerStore } from "@/stores/formviewer";
import { endpoints } from "@/api/api";
const CheckboxGroup = defineAsyncComponent(() => import("./CheckboxGroup.vue"));
const props = defineProps<{
  element: any;
}>();
let options = ref(props.element.properties.options);
if (props.element.properties.optionsEndpoint) {
  options.value = useFormViewerStore().loadOptions(props.element.id, props.element.properties.optionsEndpoint);
}


console.log("options", options);
const emit = defineEmits(["update"]);
const value = ref("" as any);
const n = parseInt(
  useFormViewerStore().getValueForId(props.element.properties.extId)
);
if (!isNaN(n)) {
  value.value = n;
} else {
  value.value = undefined;
}
watch(
  () => value.value,
  (newValue: any) => {
    emit("update", newValue);
  }
);
</script>
