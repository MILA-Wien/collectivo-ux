<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import type { PropType } from "vue";
import type { StoreGeneric } from "pinia";
import type { endpoints } from "@/api/api";

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

const successToast = (message: String) => {
  toast.add({
    severity: "success",
    summary: "Success",
    detail: message,
    life: 5000,
  });
};
const errorToast = (e: any) => {
  toast.add({
    severity: "error",
    summary: "Error",
    detail: `Update failed. Request-id: "${e?.response?.headers["x-request-id"]}
      " Response: "${JSON.stringify(e?.response?.data)}"`,
  });
};

// Create temporary copy of the object
const object_temp = ref(JSON.parse(JSON.stringify(props.object)));

// Reactive settings
const isVisible = ref(true);
const isSaving = ref(false);

// Functions
function closeModal() {
  emit("close");
}
async function createObject() {
  isSaving.value = true;
  try {
    await props.store.create(props.name, object_temp.value);
    successToast("Object has been created.");
    emit("close");
  } catch (error) {
    console.log(error);
    errorToast(error);
  }
  isSaving.value = false;
}
async function updateObject() {
  console.log(object_temp.value);
  isSaving.value = true;
  try {
    await props.store.update(
      props.name,
      object_temp.value["id"],
      object_temp.value
    );
    successToast("Object has been updated.");
    emit("close");
  } catch (error) {
    console.log(error);
    errorToast(error);
  }
  isSaving.value = false;
}
async function deleteObject() {
  isSaving.value = true;
  try {
    await props.store.delete(props.name, object_temp.value["id"]);
    successToast("Object has been deleted.");
  } catch (error) {
    console.log(error);
    errorToast(error);
  }
  emit("close");
  isSaving.value = false;
}
const confirmDelete = () => {
  confirm.require({
    message: "Are you sure you want to delete this object?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      deleteObject();
    },
  });
};
</script>

<template>
  <div>
    <ConfirmDialog></ConfirmDialog>
    <DialogPrime
      :header="t(name) + ' ' + object.id"
      v-model:visible="isVisible"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '80vw' }"
      :modal="true"
      @hide="closeModal"
    >
      <div class="modal-content">
        <!-- Read only fields -->
        <div v-if="!create">
          <div v-for="(field, name, i) in schema" :key="i" class="field">
            <div v-if="field.read_only">
              <span class="font-bold">{{ field.label }}</span
              >: {{ object_temp[name] }}
            </div>
          </div>
        </div>

        <!-- Editable fields -->
        <div v-for="(field, name, i) in schema" :key="i" class="field">
          <div v-if="!field.read_only">
            <label for="attr-{{name}}">
              {{ field.label }}
              <span v-if="field.required" class="text-red-600">*</span>
            </label>

            <div v-if="field.input_type === 'select'">
              <DropdownPrime
                v-model="object_temp[name]"
                :options="field.options"
                optionLabel="label"
                optionValue="value"
                :filter="true"
                :disabled="field.read_only"
                placeholder="Select a choice"
              />
            </div>

            <div v-else-if="field.input_type === 'html'">
              TODO CHANGE THIS TO A HTML EDIT FIELD<br />
              <InputTextPrime
                id="attr-{{name}}"
                type="text"
                aria-describedby="attr-{{value}}-help"
                v-model="object_temp[name]"
                :disabled="field.read_only"
              />
            </div>

            <div v-else>
              <InputTextPrime
                id="attr-{{name}}"
                type="text"
                aria-describedby="attr-{{value}}-help"
                v-model="object_temp[name]"
                :disabled="field.read_only"
              />
            </div>

            <small
              v-if="field.help_text"
              id="user-attr-{{value}}-help"
              class="p-info"
              >{{ field.help_text }}</small
            >
          </div>
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
          @click="updateObject()"
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
          @click="confirmDelete()"
          class="p-button-danger"
        />
      </template>
    </DialogPrime>
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
