<template>
  <div :class="getClass" :id="element.id" v-if="show">
    <div :class="element.type">
      <div
        class="element-header"
        v-if="
          element.type != 'button' &&
          element.type != 'formset' &&
          element.type != 'paragraph' &&
          !element.properties.hideLabel &&
          element.type != 'calculation'
        "
      >
        <label class="element-label" v-if="!element.properties.hideLabel">
          {{
            element.properties.label ? element.properties.label : element.type
          }}
          <span class="required" v-if="element.properties.required">*</span>
        </label>
      </div>
      <div
        v-if="
          (element.type == 'formset' || element.type == 'paragraph') &&
          !element.properties.hideLabel
        "
        class="element-header"
      >
        <h3>
          {{
            element.properties.label ? element.properties.label : element.type
          }}
          <span class="required" v-if="element.properties.required">*</span>
        </h3>
      </div>
      <div
        v-if="
          element.properties.description !== undefined &&
          element.type != 'calculation'
        "
      >
        <small>{{ element.properties.description }}</small>
      </div>
      <div class="single-choice" v-if="element.type == 'singleChoice'">
        <radio-group :element="element" @change="valueChange($event.value)" />
      </div>
      <div class="multiple-choice" v-else-if="element.type == 'multipleChoice'">
        <checkbox-group :element="element" @change="valueChange($event)" />
      </div>
      <div v-else-if="element.properties.htmlType == 'p'">
        <p>{{ element.properties.content }}</p>
      </div>
      <div v-else-if="element.type == 'plainHtml'">
        <div v-html="element.properties.content"></div>
      </div>
      <div class="image" v-else-if="element.type == 'image'">
        <img :src="element.properties.src" />
      </div>
      <div
        v-else-if="element.properties.htmlType !== undefined"
        class="html-input d-flex"
      >
        <PrimeText
          v-if="element.properties.htmlType === 'text'"
          @change="valueChange($event)"
          v-model="value"
        ></PrimeText>
        <input
          v-else
          class="form-control"
          @input="valueChange($event)"
          :type="element.properties.htmlType"
        />
      </div>
      <!-- <div v-else-if="element.type == 'signature'">
        <signature @update="valueChange($event)" />
      </div> -->
      <div v-else-if="element.type == 'calculation'">
        <calculation @update="valueChange($event)" :element="element" />
      </div>
      <div v-else-if="element.type == 'date'">
        <date @update="valueChange($event)" :element="element" />
      </div>
      <div v-else-if="element.type == 'number'">
        <number @update="valueChange($event)" :element="element" />
      </div>
      <div v-else-if="element.type == 'button'">
        <PrimeButton class="btn btn-primary" @click="buttonClick(element)">
          {{ element.properties.label }}
        </PrimeButton>
      </div>
    </div>
    <div
      class="formset-elements"
      :id="'formset-' + element.id"
      v-if="props.element.children.length > 0 && element.type == 'formset'"
    >
      <div
        v-for="(e, i) in element.children"
        v-bind:key="e.type + '_' + String(i)"
        class="formset-element-item"
      >
        <element-blueprint
          :element="e"
          @formSubmit="$emit('formSubmit')"
          :path="path.concat(element.id)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  defineAsyncComponent,
  ref,
  watch,
} from "vue";
import { useFormViewerStore } from "../../../stores/formviewer";
import { storeToRefs } from "pinia";

const ElementBlueprint = defineAsyncComponent(() => import("./Element.vue"));
const Calculation = defineAsyncComponent(
  () => import("./ElementCalculation.vue")
);
const RadioGroup = defineAsyncComponent(() => import("./RadioGroup.vue"));
const CheckboxGroup = defineAsyncComponent(() => import("./CheckboxGroup.vue"));
const Number = defineAsyncComponent(() => import("./ElementNumber.vue"));
const Date = defineAsyncComponent(() => import("./ElementDate.vue"));
const PrimeButton = defineAsyncComponent(() => import("primevue/button"));
const PrimeText = defineAsyncComponent(() => import("primevue/inputtext"));
const formViewerStore = useFormViewerStore();
const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
  path: {
    type: Array,
    required: true,
  },
});
function valueChange(val: any) {
  let value = val;
  if (val.target) value = val.target.value;
  formViewerStore.updateValue(props.element.properties.extId, value);
}
const { validationFaults, values } = storeToRefs(formViewerStore);
function checkValidationFailed() {
  if (validationFaults.value.includes(props.element.id)) {
    return " validation-failed";
  }
  return "";
}
const emit = defineEmits(["formSubmit", "nextPage", "goToPage", "blub"]);
function buttonClick(element: any) {
  if (element.properties.buttonType == "next") {
    formViewerStore.validatePage();
    emit("nextPage");
  } else if (element.properties.buttonType == "goToPage") {
    emit("goToPage", element.properties.goToPage);
  } else if (element.properties.buttonType == "back") {
    formViewerStore.previousPage();
  } else if (element.properties.buttonType == "submit") {
    emit("formSubmit");
  }
}
let value: any = ref(
  formViewerStore.getValueForId(props.element.properties.extId)
);
watch(value, (val: any) => {
  valueChange(val);
});

function getClass() {
  return "element" + checkCondition() + checkValidationFailed();
}
function checkCondition() {
  if (props.element.type === "formset" && props.element.children.length == 0)
    return false;
  // no conditions
  if (props.element.properties.conditions.length == 0) return true;
  // check first condition
  var condition = props.element.properties.conditions[0];
  if (condition.target == null) return true;
  let targetValue = values.value[condition.target];
  if (targetValue == undefined) return false;
  if (String(condition.value) == targetValue) {
    return true;
  }
  return false;
}
const show = ref(checkCondition());
</script>
<script lang="ts">
export default {
  name: "ElementBlueprint",
};
</script>

<style scoped>
.element {
  width: 100%;
  border-radius: 3px;
  padding: 2px;
}

.element-header {
  min-height: 42px;
}

.element input {
  margin-bottom: 10px;
}

.element-label {
  margin-bottom: 0px;
  word-wrap: break-word;
}

.image img {
  max-width: 100%;
}

.disabled {
  color: grey;
}

.hidden {
  display: none !important;
}

img {
  max-width: 100%;
}

input {
  width: 100%;
}

.required {
  color: red;
}

.validation-failed {
  border-left: 3px solid red;
}

.formset-elements {
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  width: 100%;
}

.formset-element-item {
  display: flex;
  align-items: center;
  height: 100%;
}

#formset-uNmhrILdTZge {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
