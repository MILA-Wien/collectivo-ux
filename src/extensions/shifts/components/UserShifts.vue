<script setup lang="ts">
import { useShiftsStore } from "../stores/shifts";
import { ref, onMounted } from "vue";
import PrimeButton from "primevue/button";
import PrimeDialog from "primevue/dialog";

import { useMenuStore } from "@/stores/menu";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const menuStore = useMenuStore();
menuStore.setTitle("User Shifts");

const shiftsStore = useShiftsStore();
onMounted(() => {
  shiftsStore.getShiftsForSelf();
});
const showAssignShiftDialog = ref(false);
function openAssignShiftDialog() {
  showAssignShiftDialog.value = true;
  shiftsStore.getOpenShifts();

}
</script>

<template>
  <div class="user-shifts-wrapper">
    <div v-if="shiftsStore.selfShifts.length > 0">
    </div>
    <div v-else>
      <p>{{t("No shifts found")}}</p>
      <PrimeButton @click="openAssignShiftDialog()">{{t("Assign new shift")}}</PrimeButton>
      <PrimeDialog v-model:visible="showAssignShiftDialog" :modal="true" :closable="false" :dismissableMask="true" :showHeader="false" :baseZIndex="10000">
        <template #footer>
          <PrimeButton @click="showAssignShiftDialog = false">{{t("Close")}}</PrimeButton>
        </template>
      </PrimeDialog>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.user-shifts-wrapper {
  height: 100%;
  max-height: 70vh;
}
</style>

<style lang="scss">
.fc.fc-theme-standard .fc-toolbar .fc-button.fc-dayGridMonth-button.fc-button-active,
.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridWeek-button.fc-button-active,
.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridDay-button.fc-button-active {
  background: #2db3a5 !important;
  border-color: #2db3a5 !important;
  color: #ffffff;
}

.fc.fc-theme-standard .fc-toolbar .fc-button {
  color: #ffffff;
  background: #2db3a5 !important;
  border: 1px solid #2db3a5 !important;
}

.fc.fc-theme-standard .fc-toolbar .fc-button:enabled:hover {
  background: #3cd2c3 !important;
  color: #ffffff;
  border-color: #2db3a5 !important;
}

.fc-daygrid-day-number,
.fc-col-header-cell-cushion {
  color: #000;
}
</style>
