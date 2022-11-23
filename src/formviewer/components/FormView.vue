<template>
  <div class="form-view">
    <p v-for="error of validation.$errors" :key="error.$uid">
      {{ error.$propertyPath }}: {{ error.$message }}
    </p>
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
import { useVuelidate } from "@vuelidate/core";
// store
const formViewerStore = useFormViewerStore();
const { tree, currentPage } = storeToRefs(formViewerStore);
const validation = useVuelidate();
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
<style scoped>
.form-view {
  max-height: 80vh;
  overflow-x: scroll;
}
</style>
