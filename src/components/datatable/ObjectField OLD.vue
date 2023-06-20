<script setup lang="ts">
import { checkCondition } from "@/helpers/schema";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
  field: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Object,
    required: true,
  },
  isInvalid: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },

});

const emits = defineEmits(["update:modelValue"]);
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
      v-model="modelValue"
      :options="field.options"
      optionLabel="label"
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
      v-model="object_temp[name]"
      :options="field.options"
      optionLabel="label"
      optionValue="value"
      :maxSelectedLabels="0"
      :selectedItemsLabel="`${object_temp[name]?.length} selected`"
      :filter="true"
      :placeholder="t('Select multiple choices')"
      :class="{ 'p-invalid': isInvalid(name) }"
      class="w-full"
      :disabled="checkCondition(object_temp, field.read_only)"
    />
  </div>

  <div
    v-else-if="field.input_type === 'checkbox'"
    class="flex flex-row"
  >
    <PrimeInputSwitch
      v-model="object_temp[name]"
      :disabled="checkCondition(object_temp, field.read_only)"
      :class="{ 'p-invalid': isInvalid(name) }"
      class="flex-none mr-2"
    />
    <small
      v-if="field.help_text"
      id="user-attr-{{value}}-help"
      class="p-info"
      >{{ field.help_text }}</small
    >
  </div>

  <div v-else-if="field.input_type === 'date'">
    <PrimeCalendar
      v-model="object_temp[name]"
      dateFormat="yy-mm-dd"
      :manualInput="true"
      :disabled="checkCondition(object_temp, field.read_only)"
      :class="{ 'p-invalid': isInvalid(name) }"
    />
  </div>

  <div v-else-if="field.input_type === 'textarea'">
    <PrimeTextarea
      v-model="object_temp[name]"
      :disabled="checkCondition(object_temp, field.read_only)"
      :class="{ 'p-invalid': isInvalid(name) }"
      style="width: 100%"
    />
  </div>

  <div v-else-if="field.input_type === 'html'">
    <FieldRichText v-model="object_temp[name]"></FieldRichText>
  </div>

  <div v-else-if="field.input_type === 'image'">
    <div class="pb-2">
      <input
        type="file"
        class=""
        @change="(event:any) => prepareUpload(event, name)"
      />
      <input
        v-if="object_temp[name]"
        type="button"
        value="Remove image"
        @click="removeUpload(name)"
      />
    </div>
    <img
      :src="
        pending_uploads[name]
          ? pending_uploads[name]
          : object_temp[name]
      "
      v-if="object_temp[name] || pending_uploads[name]"
      alt="Project logo"
      class="max-w-xs max-h-xs"
    />
  </div>
  <div v-else>
    <PrimeInputText
      id="attr-{{name}}"
      type="text"
      aria-describedby="attr-{{value}}-help"
      v-model="object_temp[name]"
      :placeholder="field.write_only ? '********' : ''"
      :disabled="checkCondition(object_temp, field.read_only)"
      :class="{ 'p-invalid': isInvalid(name) }"
      class="w-full"
    />
  </div>
  <div>
    <small v-if="isInvalid(name)" class="p-error">{{
      returnErrorMessage(name)
    }}</small>
  </div>
  <div>
    <small
      v-if="field.help_text && field.input_type !== 'checkbox'"
      id="user-attr-{{value}}-help"
      class="p-info"
      >{{ t(field.help_text) }}</small
    >
  </div>
</div>
</div></template>
