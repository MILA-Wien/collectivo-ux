<template>
  <div class="element-page" name="page">
    <div v-for="(e, i) in page?.children" v-bind:key="e.type + '_' + String(i)" class="element-page-items">
      <ElementBlueprint :element="e" :path="[page?.id]" @formSubmit="$emit('formSubmit')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import ElementBlueprint from "./Element.vue";
import { useFormViewerStore } from "@/stores/formviewer";
import { minLength, required, maxLength } from "@vuelidate/validators";
import { ElementPage, type Element } from "@/formviewer/types/elements";
import { useVuelidate } from "@vuelidate/core";

const formViewerStore = useFormViewerStore();
const props = defineProps({
  page: ElementPage,
});
function getAllChildElements(element: Element) {
  let children: Element[] = [];
  if (element.children) {
    children = children.concat(element.children);
    for (let i = 0; i < element.children.length; i++) {
      children = children.concat(getAllChildElements(element.children[i]));
    }
  }
  return children;
}
const allElements = computed(() => {
  if (props.page) {
    return getAllChildElements(props.page);
  }
  return [];
});
let rules: any = {};
for (let i = 0; i < allElements.value.length; i++) {
  const element = allElements.value[i];
  if (element.properties?.required) {
    const selector = element.properties?.extId;
    if (element.properties?.required && selector) {
      rules[selector] = {
        required,
        minLength: minLength(1),
        maxLength: maxLength(255),
        $autoDirty: true,
      };
    }
  }
}
const v$ = useVuelidate(rules, formViewerStore.values);

function nextPage() {
  // validate current page
  v$.value.$validate().then((isFormCorrect: boolean) => {
    if (isFormCorrect) {
      formViewerStore.nextPage();
    }
  });
}
// watch for a validation event to call the next page
watch(
  () => formViewerStore.getValidateCurrentPage,
  (val: any) => {
    if (val) {
      nextPage();
    }
  }
);
</script>

<style scoped>
.element-page {
  width: 100%;
  display: flex;
  text-align: left;
  margin: 0px 0px 5px 00px;
  padding: 10px;
  flex-direction: column;
  border-radius: 5px;
}

.element-page-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid grey;
  margin-bottom: 10px;
}
</style>