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
            element.properties.label
              ? t(element.properties.label)
              : t(element.type)
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
            element.properties.label
              ? t(element.properties.label)
              : t(element.type)
          }}
          <span class="required" v-if="element.properties.required">*</span>
        </h3>
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
      <div v-else-if="element.type === 'textfield'" class="html-input">
        <PrimeText @change="valueChange($event)" v-model="value">
        </PrimeText>
      </div>
      <div v-else-if="element.type === 'textarea'" class="html-input">
        <PrimeTextarea @change="valueChange($event)" v-model="value" :autoResize="true" rows="5" cols="30">
        </PrimeTextarea>
      </div>
      <div v-else-if="element.properties.htmlType !== undefined" class="html-input">
        <PrimeText v-if="element.properties.htmlType === 'text'" @change="valueChange($event)" v-model="value">
        </PrimeText>
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
        <PrimeButton
          class="btn btn-primary"
          style="margin-top: 20px"
          @click="buttonClick(element)"
          :label="t(element.properties.label)"
          icon="pi "
          iconPos="right"
          :loading="isLoading"
        />
      </div>
    </div>
    <div
      class="formset-elements"
      :id="'formset-' + element.id"
      v-if="props.element.children.length > 0"
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
    <div
      v-if="
        element.properties.description !== undefined &&
        element.type != 'calculation'
      "
      class="description"
    >
      <small>{{ t(element.properties.description) }}</small>
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
import { useI18n } from "vue-i18n";
const { t } = useI18n();

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
const PrimeTextarea = defineAsyncComponent(() => import("primevue/textarea"));
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
  if (val && val.target) value = val.target.value;
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
const isLoading = ref(false);
function buttonClick(element: any) {
  if (element.properties.buttonType == "next") {
    formViewerStore.validatePage();
    emit("nextPage");
  } else if (element.properties.buttonType == "goToPage") {
    emit("goToPage", element.properties.goToPage);
  } else if (element.properties.buttonType == "back") {
    formViewerStore.previousPage();
  } else if (element.properties.buttonType == "submit") {
    console.log("submit");
    isLoading.value = true;
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
  if (!condition.type) {
    let targetValue = values.value[condition.target];
    if (targetValue == undefined) return false;
    if (String(condition.value) == targetValue) {
      return true;
    }
  } else if (condition.type === "not") {
    if (values.value[condition.target] == undefined) {
      return false;
    }
    if (
      values.value[condition.target] != condition.values[0] &&
      values.value[condition.target] != condition.values[1]
    ) {
      return true;
    }
  }
  return false;
}
const show = ref(checkCondition());
watch(values.value, () => {
  show.value = checkCondition();
});
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
  /* min-height: 42px; */
  margin-top: 15px;
  margin-bottom: 10px;
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

.description {
  margin-bottom: 10px;
}

.formset-elements {
  border-radius: 3px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

.formset-element-item {
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: 10px;
  /* min-width: 250px; */
}

#formset-uNmhrILdTZge {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#formset-eufnsig7fh {
  flex-direction: column;
}


#warucmPWTOqEeE, #SOZialVwcJiztoBG, #regelcJiztoBG {
  border: 1px solid;
  padding: 10px 20px 10px 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

#SOZialVwcJiztoBG, #regelcJiztoBG {
  border: 1px solid;
  padding: 20px 20px 20px 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.element-page-items .form-control {
  width: 20px;
  height: 20px;
}
</style>
