<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";
import MemberDetail from "./MemberDetail.vue";
const { t } = useI18n();

const emit = defineEmits(["update:member", "delete:member"]);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  members: {
    type: Object,
    required: true,
  },
});
let selectedMember = ref({});
const editMember = ref(false);
function edit(event: any) {
  selectedMember.value = event;
  editMember.value = true;
}
</script>

<template>
  <div class="members-table">
    <DataTable
      :value="members.results"
      :paginator="true"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      responsiveLayout="scroll"
      :globalFilterFields="['id', 'user_id', 'user_attr']"
      :currentPageReportTemplate="
        t('Showing') +
        ' {first} ' +
        t('to') +
        ' {last} ' +
        t('of') +
        ' {totalRecords}'
      "
    >
      <Column field="id" :header="t('Id')"></Column>
      <Column field="user_id" :header="t('user_id')"></Column>
      <Column field="user_attr" :header="t('user_attr')"></Column>
      <Column field="admin_attr" :header="t('admin_attr')"></Column>
      <Column :header="t('actions')">
        <template #body="slotProps">
          <ButtonPrime
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success p-mr-2"
            @click="edit(slotProps.data)"
          />
          <ButtonPrime
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="emit('delete:member', slotProps.data)"
          ></ButtonPrime>
        </template>
      </Column>
      <template #paginatorstart>
        <ButtonPrime type="button" icon="pi pi-refresh" class="p-button-text" />
      </template>
    </DataTable>
    <MemberDetail
      v-if="editMember"
      :member="selectedMember"
      @close="editMember = false"
      @change="emit('update:member', $event)"
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
