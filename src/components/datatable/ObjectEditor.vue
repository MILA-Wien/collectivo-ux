<template>
  <div class="editor-wrapper">
    <Button label="Toggle Html edit " @click="html = !html" class="html-toogle"/>
    <Textarea v-if="html" v-model="data" :autoResize="true" rows="5" cols="30" />
    <editor v-else v-model="data" :disabled="disabled" editorStyle="height: 320px" />
  </div>

</template>

<script setup lang="ts">
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Editor from "primevue/editor";
import { ref, watch } from "vue";

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