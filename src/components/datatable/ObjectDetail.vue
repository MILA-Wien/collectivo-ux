<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import type { PropType } from "vue";
import type { StoreGeneric } from "pinia";
import type { endpoints } from "@/api/api";
import ObjectEditor from "@/components/datatable/ObjectEditor.vue";
import PrimeDialog from "primevue/dialog";
import PrimeButton from "primevue/button";
import PrimeInputText from "primevue/inputtext";
import PrimeConfirmDialog from "primevue/confirmdialog";
import PrimeInputSwitch from "primevue/inputswitch";
import PrimeDropdown from "primevue/dropdown";
import PrimeMultiSelect from "primevue/multiselect";
import PrimeTextarea from "primevue/textarea";

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
  isSaving.value = true;
  try {
    await props.store.update(
      props.name,
      object_temp.value,
      object_temp.value["id"]
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

function getHeader() {
  if (props.create) {
    return t("Create") + ": " + t(props.name);
  } else {
    return t(props.name) + " " + props.object.id;
  }
}

const filterValue = ref("");
function isFiltered(name: string) {
  if (filterValue.value === "") {
    return true;
  }
  return t(props.schema[name].label)
    .toLowerCase()
    .includes(filterValue.value.toLowerCase());
}
</script>

<template>
  <div>
    <PrimeConfirmDialog></PrimeConfirmDialog>
    <PrimeDialog
      :header="getHeader()"
      v-model:visible="isVisible"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '80vw' }"
      :modal="true"
      :maximizable="true"
      @hide="closeModal"
    >
      <div class="object-detail-fields mt-5">
        <!-- Editable fields based on input type -->
        <div
          v-for="(field, name, i) in schema"
          :key="i"
          class="field"
          :style="isFiltered(name) ? '' : 'position:absolute'"
        >
          <div v-if="isFiltered(name)">
            <div class="mb-1">
              <label for="attr-{{name}}">
                {{ t(field.label) }}
                <span v-if="field.required" class="text-red-600">*</span>
              </label>
            </div>

            <div v-if="field.input_type === 'select'">
              <PrimeDropdown
                v-model="object_temp[name]"
                :options="field.options"
                optionLabel="label"
                optionValue="value"
                :filter="true"
                placeholder="Select a choice"
                :showClear="true"
                class="w-full"
                :disabled="field.read_only"
              />
            </div>

            <div v-else-if="field.input_type === 'multiselect'">
              <PrimeMultiSelect
                v-model="object_temp[name]"
                :options="field.options"
                optionLabel="label"
                optionValue="value"
                :maxSelectedLabels="0"
                :selectedItemsLabel="`${object_temp[name]?.length} selected`"
                :filter="true"
                placeholder="Select multiple choices"
                class="w-full"
                :disabled="field.read_only"
              />
            </div>

            <div v-else-if="field.input_type === 'checkbox'">
              <PrimeInputSwitch
                v-model="object_temp[name]"
                :disabled="field.read_only"
              />
            </div>

            <div v-else-if="field.input_type === 'textarea'">
              <PrimeTextarea
                v-model="object_temp[name]"
                :disabled="field.read_only"
              />
            </div>

            <div v-else-if="field.input_type === 'html'">
              <object-editor v-model="object_temp[name]"></object-editor>
            </div>

            <div v-else>
              <PrimeInputText
                id="attr-{{name}}"
                type="text"
                aria-describedby="attr-{{value}}-help"
                v-model="object_temp[name]"
                :disabled="field.read_only"
                class="w-full"
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

      <!-- Footer -->
      <template #footer>
        <div class="object-detail-filter flex flex-row mt-5 items-center">
          <i
            class="pi pi-filter m-auto pl-1 pr-3"
            style="font-size: 1.2rem"
          ></i>
          <PrimeInputText
            id="filter"
            v-model="filterValue"
            placeholder="Filter"
            type="text"
            class="w-96"
          />
          <div class="grow"></div>
          <PrimeButton
            v-if="create"
            :label="t('Create')"
            :loading="isSaving"
            icon="pi pi-check"
            class="p-button-success"
            @click="createObject()"
          />
          <PrimeButton
            v-else
            :label="t('Save')"
            :loading="isSaving"
            icon="pi pi-check"
            @click="updateObject()"
          />
          <PrimeButton
            :label="t('Cancel')"
            icon="pi pi-times"
            @click="closeModal"
            class="p-button-secondary"
          />
          <PrimeButton
            :label="t('Delete')"
            v-if="!create"
            icon="pi pi-trash"
            @click="confirmDelete()"
            style="margin-right: 0px"
            class="p-button-danger"
          />
        </div>
      </template>
    </PrimeDialog>
  </div>
</template>
<style lang="scss">
.object-detail-fields {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 250px);
  gap: 20px;
  place-content: left;
}
.field {
  padding: 8px;
}
label {
  font-weight: bold;
}
.p-dialog .p-dialog-header,
.p-dialog .p-dialog-footer {
  background-color: rgb(236, 236, 236);
}
</style>
