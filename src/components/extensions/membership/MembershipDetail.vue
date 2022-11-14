<script setup lang="ts">
import { ref } from "vue";
import Dialog from "primevue/dialog";
import { useI18n } from "vue-i18n";
import InputText from "primevue/inputtext";

const { t } = useI18n();
const emit = defineEmits(["change", "close"]);
const props = defineProps({
  membership: {
    type: Object,
    required: true,
  },
});
const membership_attributes = ref(JSON.parse(JSON.stringify(props.membership)));
const displayModal = ref(true);
function closeModal() {
  emit("close");
}
function save() {
  emit("change", membership_attributes.value);
  emit("close");
}
</script>
<template>
  <div>
    <Dialog
      :header="t('Edit user') + ' ' + membership.id"
      v-model:visible="displayModal"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
      :modal="true"
      @hide="closeModal"
    >
      <div class="modal-content">
        <div
          v-for="(value, key) in Object.keys(membership_attributes)"
          :key="value ? key + value : key"
          class="field"
        >
          <label for="user-attr-{{value}}">{{ value }}</label>
          <InputText
            id="user-attr-{{value}}"
            type="text"
            aria-describedby="user-attr-{{value}}-help"
            v-model="membership_attributes[value]"
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
