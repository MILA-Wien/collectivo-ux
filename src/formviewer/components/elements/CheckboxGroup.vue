<template>
  <div class="radio-group" v-if="props.element.properties?.options">
    <div
      v-for="o in props.element.properties.options"
      v-bind:key="props.element.properties.label + String(o.id)"
    >
      <input
        type="checkbox"
        class="mr-2"
        @change="toggleValue(o.id)"
        :checked="values.includes(o.id)"
        :value="o.id"
        :name="props.element.id + o.id"
      />
      <label class="font-light">{{ t(o.name) }}</label>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFormViewerStore } from "@/stores/formviewer";
import { ref } from "vue";
const props = defineProps<{
  element: any;
}>();
const valueFromStore = useFormViewerStore().getValueForId(
  props.element.properties.extId
);
const emit = defineEmits(["change"]);
const values = ref([] as any);
if (!valueFromStore) {
  props.element.properties.options.forEach(
    (o: string) => (values.value[o] = false)
  );
} else {
  values.value = valueFromStore;
}

function toggleValue(v: number) {
  if (values.value.includes(v)) {
    values.value.splice(values.value.indexOf(v), 1);
  } else values.value.push(v);
  emit("change", values);
}
</script>

<script lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
export default {
  name: "ElementCheckboxGroup",
};
</script>
