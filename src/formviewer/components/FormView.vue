<template>
  <div class="form-view">
    <div
      class="form-page"
      v-for="(e, i) in tree?.children"
      v-bind:key="e.type + '_' + String(i)"
    >
      <FormPage
        v-if="currentPage == e.id"
        :page="e"
        :id="i"
        @formSubmit="$emit('formSubmit')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFormViewerStore } from "@/stores/formviewer";
import { storeToRefs } from "pinia";
import { defineAsyncComponent } from "vue";
// store
const formViewerStore = useFormViewerStore();
const { tree, currentPage } = storeToRefs(formViewerStore);
const FormPage = defineAsyncComponent(
  () => import("./elements/ElementPage.vue")
);
if (
  currentPage.value == null &&
  tree.value?.children &&
  tree.value.children?.length > 0
) {
  formViewerStore.setCurrentPage(tree.value.children[0].id);
}
</script>
