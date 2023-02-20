<template>
  <div class="radio-group">
    <div
      class="form-check"
      v-for="(o, j) in element.properties.options"
      v-bind:key="element.properties.label + String(j)"
    >
      <input
        type="radio"
        class="form-check-input"
        @change="emit('change', $event.target)"
        :value="element.properties.values[j]"
        :name="element.id"
        :checked="value === element.properties.values[j]"
      />
      <label class="form-check-label me-2 font-light">{{ t(o) }}</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useFormViewerStore } from "@/stores/formviewer";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  element: any;
}>();
const value = ref("" as any);
value.value = useFormViewerStore().getValueForId(
  props.element.properties.extId
);
const emit = defineEmits(["change"]);
</script>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: row;
  margin-left: 3px;
}
.form-check {
  margin-right: 15px;
}
.form-check-input {
  margin-right: 5px;
  margin-bottom: 3px;
}
</style>
