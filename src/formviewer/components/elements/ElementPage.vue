<template>
  <div class="element-page" name="page">
    <h2 v-if="page?.name" class="mb-2">{{ t(page.name) }}</h2>
    <div
      v-for="(e, i) in page?.children"
      v-bind:key="e.type + '_' + String(i)"
      class="element-page-items"
    >
      <ElementBlueprint
        :element="e"
        :path="[page?.id]"
        @formSubmit="submit()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import ElementBlueprint from "./Element.vue";
import { useFormViewerStore } from "@/stores/formviewer";
import {
  minLength,
  required,
  maxLength,
  minValue,
  maxValue,
  sameAs,
} from "@vuelidate/validators";
import { ElementPage, type Element } from "@/formviewer/types/elements";
import { useVuelidate } from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import { isValidIBAN, electronicFormatIBAN } from "ibantools";
const { t } = useI18n();
const europeanIBAN = [
  "AD",
  "AT",
  "BE",
  "BG",
  "CH",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GI",
  "GR",
  "HR",
  "HU",
  "IE",
  "IS",
  "IT",
  "LI",
  "LT",
  "LU",
  "LV",
  "MC",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
];

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
const validAccountNumber = helpers.withParams(
  { type: "validValue" },
  (value: string) => {
    const iban = electronicFormatIBAN(value);
    if (iban && europeanIBAN.includes(iban.substring(0, 2))) {
      return isValidIBAN(iban || "");
    }
    return false;
  }
);
for (let i = 0; i < allElements.value.length; i++) {
  const element = allElements.value[i];
  if (element.properties?.required) {
    const selector = element.properties?.extId;
    if (element?.properties?.required && selector) {
      // check conditions
      if (
        element.properties?.conditions &&
        element.properties?.conditions?.length > 0
      ) {
        if (
          element.properties?.conditions[0].value ===
          formViewerStore.values[element.properties?.conditions[0].target]
        ) {
          rules[selector] = {
            required,
            minLength: minLength(1),
            maxLength: maxLength(255),
            $autoDirty: true,
          };
        }
      } else {
        rules[selector] = {
          required,
          minLength: minLength(1),
          maxLength: maxLength(255),
          $autoDirty: true,
        };
      }
    }
    if (
      element?.properties?.validations &&
      element?.properties?.validations.length > 0
    ) {
      const selector = element.properties?.extId;
      if (selector) {
        for (let i = 0; i < element.properties?.validations.length; i++) {
          const validation = element.properties?.validations[i];
          if (!rules[selector]) {
            rules[selector] = {};
          }
          if (validation.type === "minValue" && validation.value) {
            rules[selector].minValue = minValue(validation?.value);
            rules[selector].$autoDirty = true;
          } else if (validation.type === "maxValue" && validation.value) {
            rules[selector].maxValue = maxValue(validation.value);
            rules[selector].$autoDirty = true;
          } else if (validation.type === "sameAs" && validation.value) {
            if (validation.state === true)
              rules[selector].sameAs = helpers.withMessage(
                `You have to accept the requiered field ${element.properties?.label}.`,
                sameAs(validation.value)
              );
            else rules[selector].sameAs = sameAs(validation.value);
            rules[selector].$autoDirty = true;
          } else if (validation.type === "isValidIBAN") {
            rules[selector].isValidIBAN = helpers.withMessage(
              "The provided IBAN is wrong or the IBAN is registered outside of Europe SEPA Area, please check again.",
              validAccountNumber
            );
          }
        }
      }
    }
  }
}
const v$ = useVuelidate(rules, formViewerStore.values);
const toast = useToast();

function nextPage() {
  // validate current page
  v$.value.$validate().then((isFormCorrect: boolean) => {
    if (isFormCorrect) {
      formViewerStore.nextPage();
      document.getElementsByClassName("element-page")[0]?.scrollIntoView();
    } else {
      toast.add({
        severity: "error",
        summary: t("Error"),
        detail: t("Please fill out the required fields"),
        life: 5000,
      });
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
const emit = defineEmits(["formSubmit"]);

function submit() {
  v$.value.$validate().then((isFormCorrect: boolean) => {
    if (isFormCorrect) {
      emit("formSubmit");
    } else {
      toast.add({
        severity: "error",
        summary: t("Error"),
        detail: t("Please fill out the required fields"),
        life: 5000,
      });
    }
  });
}
</script>

<style scoped>
.element-page {
  width: 100%;
  display: flex;
  text-align: left;
  margin: 0px 0px 5px 00px;
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
