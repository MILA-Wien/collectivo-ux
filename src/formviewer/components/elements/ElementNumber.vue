<template>
  <div class="number">
    <PrimeNumber :name="element.id" v-model="value" :useGrouping="false" />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import PrimeNumber from "primevue/inputnumber";
import { useFormViewerStore } from "@/stores/formviewer";
const props = defineProps<{
  element: any;
}>();
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
