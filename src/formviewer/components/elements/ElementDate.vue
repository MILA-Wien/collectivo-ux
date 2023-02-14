<template>
  <div class="date-element">
    <div class="date d-flex">
      <PrimeCalendar :name="element.id" dateFormat="dd.mm.yy" v-model="value" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import PrimeCalendar from "primevue/calendar";
import { useFormViewerStore } from "@/stores/formviewer";
const props = defineProps<{
  element: any;
}>();
const emit = defineEmits(["update"]);
const value = ref("" as any);
const valueFromStore = useFormViewerStore().getValueForId(
  props.element.properties.extId
);
if (typeof valueFromStore === "string") {
  value.value = new Date(valueFromStore);
} else {
  value.value = valueFromStore;
}
watch(
  () => value.value,
  (newValue: any) => {
    if (newValue && newValue !== null) {
      const dateFormated = newValue.toISOString().split("T")[0];
      emit("update", dateFormated);
    }
  }
);
</script>
