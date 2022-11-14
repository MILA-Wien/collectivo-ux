<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";
import MembershipDetail from "./MembershipDetail.vue";
const { t } = useI18n();

const emit = defineEmits(["update:membership"]);

const props = defineProps({
  membership: {
    type: Object,
    required: true,
  },
});
let selectedMembership = ref({});
const editMembership = ref(false);
function edit(event: any) {
  selectedMembership.value = event;
  editMembership.value = true;
}
</script>

<template>
  <div class="memberships-table">
    <DataTable
      :value="membership.profile"
    >
      <Column field="id" :header="t('Id')"></Column>
      <Column field="user_id" :header="t('user_id')"></Column>
      <Column field="user_attr" :header="t('user_attr')"></Column>
      <Column field="admin_attr" :header="t('admin_attr')"></Column>
      <Column :header="t('Edit')">
        <template #body="slotProps">
          <ButtonPrime
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success p-mr-2"
            @click="edit(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
    <MembershipDetail
      v-if="editMembership"
      :membership="selectedMembership"
      @close="editMembership = false"
      @change="emit('update:membership', $event)"
    />
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
</style>
