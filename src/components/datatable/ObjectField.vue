<script setup lang="ts">
import type { SchemaField } from "@/api/types";
import PrimeCalendar from "primevue/calendar";
import PrimeDropdown from "primevue/dropdown";
import PrimeInputSwitch from "primevue/inputswitch";
import PrimeInputText from "primevue/inputtext";
import PrimeMultiSelect from "primevue/multiselect";
import PrimeTextarea from "primevue/textarea";
import type { PropType } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import FieldRichText from "./FieldRichText.vue";
const { t } = useI18n();
defineProps({
  name: {
    type: String as PropType<any>,
    required: false,
  },
  field: {
    type: Object as PropType<SchemaField>,
    required: true,
  },
  modelValue: {
    type: null as any as PropType<any>,
    required: false,
  },
  isInvalid: {
    required: false,
  },
  disabled: {
    required: false,
    default: false,
  },
  returnErrorMessage: {
    type: null as any as PropType<any>,
    required: false,
    default: false,
  },
});

const emits = defineEmits(["update:modelValue"]);

const pending_uploads = ref<any>({});
function prepareUpload(event: any, name: any) {
  const file = event.target.files[0];
  pending_uploads.value[name] = URL.createObjectURL(file);
  emits("update:modelValue", file);
}
function removeUpload(name: any) {
  if (pending_uploads[name] != undefined) {
    pending_uploads.value[name] = null;
  }
  emits("update:modelValue", "");
}
</script>

<template>
  <div class="mb-1">
    <label for="attr-{{name}}">
      {{ t(field.label) }}
      <span v-if="field.required" class="text-red-600">*</span>
    </label>
  </div>
  <div v-if="field.input_type === 'select'">
    <PrimeDropdown
      :modelValue="modelValue"
      @update:modelValue="(val:any) => $emit('update:modelValue', val)"
      :options="field.options"
      :optionLabel="(option:any) => t(option.label)"
      optionValue="value"
      :filter="true"
      :placeholder="t('Select a choice')"
      :showClear="true"
      class="w-full"
      :class="{ 'p-invalid': isInvalid }"
      :disabled="disabled"
    />
  </div>

  <div v-else-if="field.input_type === 'multiselect'">
    <PrimeMultiSelect
      :modelValue="modelValue"
      @update:modelValue="(val:any) => $emit('update:modelValue', val)"
      :options="field.options"
      :optionLabel="(option:any) => t(option.label)"
      optionValue="value"
      :maxSelectedLabels="0"
      :selectedItemsLabel="`${modelValue?.length} selected`"
      :filter="true"
      :placeholder="t('Select multiple choices')"
      :class="{ 'p-invalid': isInvalid }"
      class="w-full"
      :disabled="disabled"
    />
  </div>

  <div v-else-if="field.input_type === 'checkbox'" class="flex flex-row">
    <PrimeInputSwitch
      :modelValue="modelValue"
      @update:modelValue="(val:any) => $emit('update:modelValue', val)"
      :disabled="disabled"
      :class="{ 'p-invalid': isInvalid }"
      class="flex-none mr-2"
    />
    <small
      v-if="field.help_text"
      id="user-attr-{{value}}-help"
      class="p-info"
      >{{ t(field.help_text) }}</small
    >
  </div>

  <div v-else-if="field.input_type === 'date'">
    <PrimeCalendar
      :modelValue="modelValue"
      @update:modelValue="(val:any) => $emit('update:modelValue', val)"
      dateFormat="yy-mm-dd"
      :manualInput="true"
      :disabled="disabled"
      :class="{ 'p-invalid': isInvalid }"
      style="width: 100%"
      showIcon
    />
  </div>

  <div v-else-if="field.input_type === 'textarea'">
    <PrimeTextarea
      :modelValue="modelValue"
      @update:modelValue="(val:any) => $emit('update:modelValue', val)"
      :disabled="disabled"
      :class="{ 'p-invalid': isInvalid }"
      style="width: 100%"
    />
  </div>

  <div v-else-if="field.input_type === 'html'">
    <FieldRichText
      :modelValue="modelValue"
      @update:modelValue="(val:any) => $emit('update:modelValue', val)"
    ></FieldRichText>
  </div>

  <div v-else-if="field.input_type === 'image'">
    <div class="pb-2">
      <input
        type="file"
        class=""
        @change="(event:any) => prepareUpload(event, name)"
      />
      <input
        v-if="modelValue"
        type="button"
        value="Remove image"
        @click="removeUpload(name)"
      />
    </div>
    <img
      :src="pending_uploads[name] ? pending_uploads[name] : modelValue"
      v-if="modelValue || pending_uploads[name]"
      alt="Uploaded image"
      class="max-w-xs max-h-xs"
    />
  </div>
  <div v-else>
    <PrimeInputText
      id="attr-{{name}}"
      type="text"
      aria-describedby="attr-{{value}}-help"
      :modelValue="modelValue"
      @update:modelValue="(val:any) => $emit('update:modelValue', val)"
      :placeholder="field.write_only ? '********' : ''"
      :disabled="disabled"
      :class="{ 'p-invalid': isInvalid }"
      class="w-full"
    />
  </div>
  <div>
    <small v-if="isInvalid" class="p-error">{{ returnErrorMessage }}</small>
  </div>
  <div>
    <small
      v-if="field.help_text && field.input_type !== 'checkbox'"
      id="user-attr-{{value}}-help"
      class="p-info"
      >{{ t(field.help_text) }}</small
    >
  </div>
</template>

<style scoped>
label {
  font-weight: bold;
}
</style>
