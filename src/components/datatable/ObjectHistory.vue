<script setup lang="ts">
import type { Schema } from "@/api/types";
import { errorToast, successToast } from "@/helpers/toasts";
import type { StoreGeneric } from "pinia";
import PrimeButton from "primevue/button";
import PrimeColumn from "primevue/column";
import PrimeDialog from "primevue/dialog";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { PropType } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ObjectTable from "./ObjectTable.vue";

const { t } = useI18n();
const emit = defineEmits(["change", "close"]);
const confirm = useConfirm();

const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
});

// Modal state ----------------------------------------------------------------
const isVisible = ref(true);
const toast = useToast();

function getHeader() {
  return t("History") + ": " + t(props.schema.label);
}

function closeModal() {
  emit("close");
}

function restore(history_id: any) {
  props.store
    .revert(props.name, history_id)
    .then(() => {
      successToast(toast, "Object has been restored.");
      closeModal();
    })
    .catch((error: any) => {
      errorToast(toast, error);
    });
}

const callRestore = (data: any) => {
  confirm.require({
    message: `${t("Are you sure you want to restore the following object: ")} ${
      props.schema.label
    } ${data.data.id} ${data.data.history_date}`,
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      restore(data.data.history_id);
    },
  });
};
</script>

<template>
  <div>
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
      <ObjectTable
        :store="store"
        :name="name"
        :default-columns="[
          'id',
          'history_date',
          'history_user',
          'history_type',
          'history_changes',
          'history_changed_fields',
        ]"
        :allow-selection="false"
        :crop-long-text="false"
      >
        <template #action-column>
          <PrimeColumn :frozen="true">
            <template #header>{{ t("Restore") }}</template>
            <template #body="slotProps">
              <PrimeButton
                :disabled="slotProps.data.history_is_latest"
                icon="pi pi-history"
                class="p-button-text p-button-sm button-edit"
                @click="callRestore(slotProps)"
              />
            </template>
          </PrimeColumn>
        </template>
      </ObjectTable>
    </PrimeDialog>
  </div>
</template>

<style scoped>
label {
  font-weight: bold;
}
</style>
