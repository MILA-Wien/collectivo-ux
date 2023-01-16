<script setup lang="ts">
import { ref } from "vue";
import Dialog from "primevue/dialog";
import { useI18n } from "vue-i18n";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";

import type { PropType } from "vue";
import type { StoreGeneric } from "pinia";
import type { endpoints } from "@/api/api";

const { t } = useI18n();
const emit = defineEmits(["change", "close"]);

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
    type: Object,
    required: true,
  },
  create: {
    type: Boolean,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
});

const toast = useToast();
const successToast = () => {
  toast.add({
    severity: "success",
    summary: "Success",
    detail: props.name + " has been updated.",
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

// Create temporary copy of the object
const object_temp = ref(JSON.parse(JSON.stringify(props.object)));

const displayModal = ref(true);
const isSaving = ref(false);
delete props.schema.id
function closeModal() {
  emit("close");
}
async function createObject() {
  isSaving.value = true;
  try {
      await props.store.create(
        props.name,
        object_temp.value);
    
    successToast();
  } catch (error) {
    console.log(error)
    errorToast(error);
  }
  emit("close");
  isSaving.value = false;
}
async function saveObject() {
  console.log(object_temp.value)
  isSaving.value = true;
    try {
      await props.store.update(
        props.name,
        object_temp.value['id'],
        object_temp.value);

    successToast();
  } catch (error) {
    console.log(error)
    errorToast(error);
  }
  emit("close");
  isSaving.value = false;
}
async function deleteObject() {
  isSaving.value = true;
    try {
      await props.store.delete(
        props.name,
        object_temp.value['id']);
    successToast();
  } catch (error) {
    console.log(error)
    errorToast(error);
  }
  emit("close");
  isSaving.value = false;
}
</script>
<template>
  <div>
    <Dialog
      :header="t(name) + ' ' + object.id"
      v-model:visible="displayModal"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '80vw' }"
      :modal="true"
      @hide="closeModal"
    >
      <div class="modal-content">
        <div
          v-for="(field, name, index) in schema"
          :key="name" class="field"
        >

          <label for="attr-{{name}}">{{ field.label }}</label>
          <div v-if="field.input_type === 'select'">
            <Dropdown 
              v-model="object_temp[name]" 
              :options="field.options" 
              optionLabel="label" 
              optionValue="value"
              :filter="true"
              :disabled="field.read_only"
              placeholder="Select a choice" />
          </div>
          <div v-else-if="field.input_type === 'html'">
            TODO CHANGE THIS TO A HTML EDIT FIELD<br/>
            <InputText
              id="attr-{{name}}"
              type="text"
              aria-describedby="attr-{{value}}-help"
              v-model="object_temp[name]"
              :disabled="field.read_only"
            />
          </div>
          <div v-else>
            <InputText
              id="attr-{{name}}"
              type="text"
              aria-describedby="attr-{{value}}-help"
              v-model="object_temp[name]"
              :disabled="field.read_only"
            />
          </div>
          <small v-if="field.help_text" id="user-attr-{{value}}-help" class="p-info">{{ field.help_text }}</small>
        </div>
      </div>
      <template #footer>
        <ButtonPrime
          v-if="create"
          :label="t('Create')"
          :loading="isSaving"
          icon="pi pi-check"
          class="p-button-success"
          @click="createObject()"
        />
        <ButtonPrime
          v-else
          :label="t('Save')"
          :loading="isSaving"
          icon="pi pi-check"
          @click="saveObject()"
        />
        
        <ButtonPrime
          :label="t('Cancel')"
          icon="pi pi-times"
          @click="closeModal"
          class="p-button-secondary"
        />
        <ButtonPrime
          :label="t('Delete')"
          v-if="!create"
          icon="pi pi-trash"
          @click="deleteObject()"
          class="p-button-danger"
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
