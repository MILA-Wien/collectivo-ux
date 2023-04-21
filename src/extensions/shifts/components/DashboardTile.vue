<script setup lang="ts">
import { useShiftsStore } from "../stores/shifts";
import { onMounted } from "vue";
import PrimeRating from "primevue/rating";
import PrimeCard from "primevue/card";
import "primeflex/primeflex.css";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const shiftsStore = useShiftsStore();
onMounted(() => {
  shiftsStore.getShiftsForSelf();
  shiftsStore.getSelfProfile();
});
</script>

<template>
  <div class="user-shifts-wrapper">
    <div class="d-flex">
      <div>{{ t("Your shift points") }}</div>
      <div>{{ shiftsStore.selfProfile.shift_points }}</div>
    </div>
    <div v-if="shiftsStore.selfShifts.length > 0">
      <div class="grid">
        <div
          v-for="(shift, i) in shiftsStore.selfShifts"
          :key="i"
          class="col-6"
        >
          <PrimeCard v-if="i < 2">
            <template #title>
              <div class="text-base">
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
        {{ t("You haven't been assiggned to any shift. Please add one.") }}
      </p>
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
.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
