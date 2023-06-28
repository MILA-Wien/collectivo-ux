<template>
  <div class="editor-wrapper">
    <PrimeButton
      v-if="html"
      :label="t('Visual editor')"
      severity="secondary"
      @click="html = !html"
      class="html-toogle"
      size="small"
    />
    <PrimeButton
      v-if="!html"
      :label="t('Raw editor')"
      severity="secondary"
      @click="html = !html"
      class="html-toogle"
      size="small"
    />
    <PrimeTextarea
      v-if="html"
      v-model="data"
      :autoResize="true"
      rows="5"
      cols="30"
    />
    <prime-editor
      v-else
      v-model="data"
      :disabled="disabled"
      editorStyle="height: 320px"
    />
  </div>
</template>

<script setup lang="ts">
import PrimeButton from "primevue/button";
import PrimeEditor from "primevue/editor";
import PrimeTextarea from "primevue/textarea";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  modelValue: String,
  disabled: Boolean,
});
const emit = defineEmits(["update:modelValue"]);
const data = ref(props.modelValue);
const disabled = ref(props.disabled);
watch(data, (value: String | undefined) => {
  emit("update:modelValue", value);
});
const html = ref(false);
</script>

<style scoped lang="scss">
.editor-wrapper {
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  .html-toogle {
    margin-bottom: 10px;
    max-width: 200px;
    align-self: flex-end;
  }
}
</style>
