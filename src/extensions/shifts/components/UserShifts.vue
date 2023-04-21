<script setup lang="ts">
import { useShiftsStore } from "../stores/shifts";
import { ref, onMounted } from "vue";
import PrimeButton from "primevue/button";
import PrimeDialog from "primevue/dialog";
import PrimeRating from "primevue/rating";
import PrimeCard from "primevue/card";
import "primeflex/primeflex.css";

import { useMenuStore } from "@/stores/menu";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const menuStore = useMenuStore();
menuStore.setTitle("Your Shifts");

const shiftsStore = useShiftsStore();
onMounted(() => {
  shiftsStore.getShiftsForSelf();
  shiftsStore.getSelfProfile();
});
const showAssignShiftDialog = ref(false);
function openAssignShiftDialog() {
  showAssignShiftDialog.value = true;
  shiftsStore.getOpenShifts();
}
function assignShift(shift: any) {
  shiftsStore.assignShift(shift);
  showAssignShiftDialog.value = false;
  shiftsStore.getShiftsForSelf();
}
</script>

<template>
  <div class="user-shifts-wrapper">
    <div v-if="shiftsStore.selfShifts.length > 0">
      <div class="grid">
        <div class="col-12">
          <p>{{ t("Your shifts") }}</p>
          <PrimeButton class="mt-1" @click="openAssignShiftDialog()">{{
            t("Assign new shift")
          }}</PrimeButton>
        </div>
        <div
          v-for="(shift, i) in shiftsStore.selfShifts"
          :key="i"
          class="col-4"
        >
          <PrimeCard>
            <template #title>
              <div class="text-base">
                {{ shift.date }}
                {{ shift.shifts[0].shift_week }} -
                {{ shift.shifts[0].shift_starting_date }} <br />
                {{ shift.shifts[0].shift_title }} -
                {{ shift.shifts[0].shift_starting_time }} -
                {{ shift.shifts[0].shift_ending_time }}
              </div>
            </template>
            <template #subtitle>
              <PrimeRating
                v-if="shift.shifts[0].assigned_users"
                v-model="shift.shifts[0].assigned_users.length"
                :cancel="false"
                :stars="shift.shifts[0].required_users"
                readonly
              >
                <template #onicon>
                  <img src="/images/shifts/custom-onicon.png" height="24" />
                </template>
              </PrimeRating>
              {{ shift.shifts[0].shift_type }}
            </template>
            <template #content>
              <div v-if="shift.shifts[0].additional_info_general != null">
                <div class="text-sm">{{ t("Additional information") }}</div>
                <div class="text-sm">
                  {{ shift.shifts[0].additional_info_general }}
                </div>
              </div>
            </template>
          </PrimeCard>
        </div>
      </div>
    </div>
    <div v-else>
      <p>
        {{
          t("You haven't been assiggned to any shift. Do you want to add one?")
        }}
      </p>
    </div>
    <div>
      <PrimeDialog
        v-model:visible="showAssignShiftDialog"
        :modal="true"
        :closable="false"
        :style="{ width: '50vw' }"
        :dismissableMask="true"
        :baseZIndex="10000"
      >
        <template #header>
          <div class="text-lg">
            {{ t("Assign new shift") }}
          </div>
        </template>

        <div class="row" v-if="shiftsStore.openShifts.length == 0">
          <div class="col-12">
            <p>{{ t("No open shifts found") }}</p>
          </div>
        </div>
        <div class="grid" v-else>
          <div
            v-for="(shifts, i) in shiftsStore.openShifts"
            :key="i"
            class="col-4"
          >
            <PrimeCard>
              <template #title>
                <div class="text-base">
                  {{ shifts.shifts[0].shift_week }} -
                  {{ shifts.shifts[0].shift_starting_date }} <br />
                  {{ shifts.shifts[0].shift_title }} -
                  {{ shifts.shifts[0].shift_starting_time }} -
                  {{ shifts.shifts[0].shift_ending_time }}
                </div>
              </template>
              <template #subtitle>
                <PrimeRating
                  v-if="shifts.shifts[0].assigned_users"
                  v-model="shifts.shifts[0].assigned_users.length"
                  :cancel="false"
                  :stars="shifts.shifts[0].required_users"
                  readonly
                >
                  <template #onicon>
                    <img
                      src="/images/shifts/custom-onicon.png"
                      height="24"
                      width="24"
                    />
                  </template>
                </PrimeRating>
                {{ shifts.shifts[0].shift_type }}
              </template>
              <template #content>
                <div v-if="shifts.shifts[0].additional_info_general != null">
                  <div class="text-sm">
                    <b>{{ t("Additional information") }}</b>
                  </div>
                  <div class="text-sm">
                    {{ shifts.shifts[0].additional_info_general }}
                  </div>
                </div>
                <PrimeButton @click="assignShift(shifts)">{{
                  t("Assign")
                }}</PrimeButton>
              </template>
            </PrimeCard>
          </div>
        </div>
        <template #footer>
          <PrimeButton @click="showAssignShiftDialog = false">{{
            t("Ready")
          }}</PrimeButton>
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
.fc.fc-theme-standard
  .fc-toolbar
  .fc-button.fc-dayGridMonth-button.fc-button-active,
.fc.fc-theme-standard
  .fc-toolbar
  .fc-button.fc-timeGridWeek-button.fc-button-active,
.fc.fc-theme-standard
  .fc-toolbar
  .fc-button.fc-timeGridDay-button.fc-button-active {
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
