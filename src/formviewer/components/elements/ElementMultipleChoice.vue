<template>
  <div class="multiple-choice">
    <checkbox-group
      :element="preparedElement"
      @change="change"
      v-if="preparedElement?.properties?.options"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, defineAsyncComponent } from "vue";
import { useFormViewerStore } from "@/stores/formviewer";
const CheckboxGroup = defineAsyncComponent(() => import("./CheckboxGroup.vue"));
const props = defineProps<{
  element: any;
}>();
let preparedElement = ref(props.element);
if (props.element.properties.optionsEndpoint) {
  useFormViewerStore()
    .loadOptions(props.element.id, props.element.properties.optionsEndpoint)
    .then((res) => {
      if (res) {
        preparedElement.value.properties.options = res.data.results;
      }
    });
}

const emit = defineEmits(["change"]);
const value = ref("" as any);
function change(n: any) {
  value.value = n;
}

watch(
  () => value.value,
  (newValue: any) => {
    emit("change", newValue);
  }
);
</script>
