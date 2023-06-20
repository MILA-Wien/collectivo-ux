<script setup lang="ts">
import type { Schema } from "@/api/types";
import type { StoreGeneric } from "pinia";
import PrimeButton from "primevue/button";
import PrimeConfirmDialog from "primevue/confirmdialog";
import PrimeDialog from "primevue/dialog";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { PropType } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ObjectEditor from "./ObjectEditor.vue";

const { t } = useI18n();
const emit = defineEmits(["change", "close"]);

const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  object: {
    type: Object,
    required: true,
  },
  id: {
    validator: (prop) =>
      typeof prop === "number" || typeof prop === "string" || prop === null,
    required: false,
  },
  create: {
    type: Boolean,
    required: true,
  },
  allow_delete: {
    type: Boolean,
    default: true,
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
});

const deleteButton = ref(false);
if (props.schema.actions?.includes("delete") || props.allow_delete) {
  deleteButton.value = true;
}

// Create temporary copy of the object
const object_temp = ref(JSON.parse(JSON.stringify(props.object)));

// Modal state ----------------------------------------------------------------
const isVisible = ref(true);

function getHeader() {
  if (props.create) {
    return t("Create") + ": " + t(props.schema.label);
  } else {
    var header = t("Edit") + ": " + t(props.schema.label);
    if (object_temp.value.id) {
      header = header + " #" + object_temp.value.id;
    }
    return header;
  }
}

function closeModal() {
  emit("close");
}

const editor = ref<any>(null);
</script>

<template>
  <div>
    <PrimeConfirmDialog></PrimeConfirmDialog>
    <PrimeDialog
      :header="getHeader()"
      class="object-detail"
      v-model:visible="isVisible"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '80vw' }"
      :modal="true"
      :maximizable="true"
      @hide="closeModal"
    >
      <ObjectEditor
        :object="object"
        :create="false"
        :store="store"
        :name="name"
        :schema="schema"
        ref="editor"
        @close="closeModal"
      />

      <!-- Footer -->
      <template #footer>
        <div
          class="object-detail-filter flex flex-row flex-wrap mt-5 items-center gap-3"
        >
          <div class="flex-grow"></div>
          <div class="flex flex-row flex-wrap gap-3">
            <PrimeButton
              v-if="create"
              :label="t('Create')"
              icon="pi pi-check"
              class="p-button-success flex-none"
              @click="editor.createObject()"
            />
            <PrimeButton
              v-else
              :label="t('Save')"
              icon="pi pi-check"
              class="flex-none"
              @click="editor.updateObject()"
            />
            <PrimeButton
              :label="t('Cancel')"
              icon="pi pi-times"
              @click="closeModal"
              class="p-button-secondary flex-none"
            />
            <PrimeButton
              :label="t('Delete')"
              v-if="!create && deleteButton"
              icon="pi pi-trash"
              @click="editor.deleteObject()"
              style="margin-right: 0px"
              class="p-button-danger flex-none"
            />
          </div>
        </div>
      </template>
    </PrimeDialog>
  </div>
</template>

<style scoped>
label {
  font-weight: bold;
}
</style>
