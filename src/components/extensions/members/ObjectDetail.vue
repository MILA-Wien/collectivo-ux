<script setup lang="ts">
import { ref } from "vue";
import Dialog from "primevue/dialog";
import { useI18n } from "vue-i18n";
import { useMembersStore } from "@/stores/members";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";

import type { PropType } from "vue";
import type { StoreGeneric } from "pinia";
import type { endpoints } from "@/api/api";

const { t } = useI18n();
const emit = defineEmits(["change", "close"]);
const membersStore = useMembersStore();
const object_label = "tag"
const toast = useToast();
const successToast = () => {
  toast.add({
    severity: "success",
    summary: "Success",
    detail: object_label + " has been updated.",
    life: 5000,
  });
};
const errorToast = (e: any) => {
  toast.add({
    severity: "error",
    summary: "Error",
    detail: `Update failed. Request-id: "${
      e?.response?.headers["x-request-id"]
    }" Response: "${JSON.stringify(e?.response?.data)}"`,
  });
};

const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String as PropType<keyof typeof endpoints>,
    required: true,
  },
  object: {
    type: Object || null,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
});

const member_attributes = ref(JSON.parse(JSON.stringify(props.object)));

const displayModal = ref(true);
const isSaving = ref(false);

function closeModal() {
  emit("close");
}
async function save() {
  isSaving.value = true;
  try {
    await props.store.update(
      props.name,
      member_attributes.value['id'],
      member_attributes.value);
    successToast();
  } catch (error) {
    errorToast(error);
  }
  emit("close");
  isSaving.value = false;
}
</script>
<template>
  <div>
    <Dialog
      :header="t('Edit user') + ' ' + object.id"
      v-model:visible="displayModal"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
      :modal="true"
      @hide="closeModal"
    >
      <div class="modal-content">
        <div
          v-for="(field, name, index) in schema"
          :key="name" class="field"
        >
          <label for="attr-{{name}}">{{ field.label }}</label>
          <InputText
            id="attr-{{name}}"
            type="text"
            aria-describedby="attr-{{value}}-help"
            v-model="object[name]"
            :disabled="field.read_only"
          />

          <small id="user-attr-{{value}}-help" class="p-info">{{ field }}</small>
        </div>
      </div>
      <template #footer>
        <ButtonPrime
          :label="t('Cancel')"
          icon="pi pi-times"
          @click="closeModal"
          class="p-button-text"
        />
        <ButtonPrime
          :label="t('Save')"
          :loading="isSaving"
          icon="pi pi-check"
          @click="save()"
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>
<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label {
  font-weight: bold;
}
</style>
