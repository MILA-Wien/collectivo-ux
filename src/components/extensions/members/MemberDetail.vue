<script setup lang="ts">
import { ref } from "vue";
import Dialog from "primevue/dialog";
import { useMembersStore } from "@/stores/members";
import { useI18n } from "vue-i18n";
import InputText from "primevue/inputtext";
import { useToast } from  "primevue/usetoast";

const { t } = useI18n();
const emit = defineEmits(["change", "close"]);

const membersStore = useMembersStore();

const toast = useToast();
const successToast = () => {
  toast.add({
    severity:'success',
    summary: 'Success',
    detail: "User has been updated.",
    life: 3000,
  })
}
const errorToast = () => {
  toast.add({
    severity:'error',
    summary: 'Error',
    detail: "Something went wrong.",
    life: 3000,
  })
}

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
});

const member_attributes = ref(JSON.parse(JSON.stringify(props.member)));

const displayModal = ref(true);
const isSaving = ref(false)

function closeModal() {
  emit("close");
}
async function save() {
  isSaving.value = true
  try {
    const response = await membersStore.updateMember(member_attributes.value);
    successToast();
  } catch (error) {
    errorToast();
  }
  emit("close");
  isSaving.value = false
}
</script>
<template>
  <div>
    <Dialog
      :header="t('Edit user') + ' ' + member.id"
      v-model:visible="displayModal"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
      :modal="true"
      @hide="closeModal"
    >
      <div class="modal-content">
        <div
          v-for="(value, key) in Object.keys(member_attributes)"
          :key="value ? key + value : key"
          class="field"
        >
          <label for="user-attr-{{value}}">{{ value }}</label>
          <InputText
            id="user-attr-{{value}}"
            type="text"
            aria-describedby="user-attr-{{value}}-help"
            v-model="member_attributes[value]"
            :disabled="value === 'id' || value === 'user_id'"
          />

          <small id="user-attr-{{value}}-help" class="p-info"
            >The User attribute {{ value }}.</small
          >
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
