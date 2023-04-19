<script setup lang="ts">
import PrimeDialog from "primevue/dialog";
import PrimeInputText from "primevue/inputtext";
import PrimeSelectButton from "primevue/selectbutton";
import PrimeCalendar from "primevue/calendar";
import PrimeTextarea from "primevue/textarea";
import PrimeButton from "primevue/button";
import PrimeInputNumber from "primevue/inputnumber";

import { useShiftsStore } from "../stores/shifts";
import { ShiftDay, ShiftType, ShiftWeek, type Shift } from "@/api/types";

import { useI18n } from "vue-i18n";
import { onMounted } from "vue";
import { ref } from "vue";

const { t } = useI18n();
const showAddShiftDialog = ref(true);
const shiftsStore = useShiftsStore();


const today = new Date();
let todayLater = new Date();
todayLater.setHours(today.getHours() + 1);

const newShift = ref<Shift>({
  shift_title: "",
  shift_starting_date: today,
  shift_ending_date: undefined,
  shift_type: ShiftType.REGULAR,
  shift_week: ShiftWeek.A,
  shift_starting_time: today,
  shift_ending_time: todayLater,
  required_users: 1,
  shift_day: ShiftDay.MONDAY,
  additional_info_general: "",
  assinged_users: [],
});
const newShiftDates = ref({
  shift_starting_date: today,
  shift_ending_date: undefined,
  shift_starting_time: today,
  shift_ending_time: todayLater,
});
function resetNewShift() {
  newShift.value = {
    shift_title: "",
    shift_starting_date: new Date(),
    shift_ending_date: undefined,
    shift_type: ShiftType.REGULAR,
    shift_week: ShiftWeek.A,
    shift_starting_time: "",
    shift_ending_time: "",
    required_users: 1,
    shift_day: ShiftDay.MONDAY,
    additional_info_general: "",
    assinged_users: [],
  };
}


const shiftTypeOptions = [
  { name: t("One time"), value: ShiftType.REGULAR },
  { name: t("Weekly"), value: ShiftType.REPEATING_WEEKLY },
  { name: t("Monthly"), value: ShiftType.REPEATING_MONTHLY },
  { name: t("Extra"), value: ShiftType.EXTRA },
  { name: t("Holiday"), value: ShiftType.HOLIDAY },
  { name: t("On call/irregular"), value: ShiftType.OTHER },
];
const shiftWeekOptions = [
  { name: "A", value: ShiftWeek.A },
  { name: "B", value: ShiftWeek.B },
  { name: "C", value: ShiftWeek.C },
  { name: "D", value: ShiftWeek.D },
];
const shiftDayOptions = [
  { name: "Monday", value: ShiftDay.MONDAY },
  { name: "Tuesday", value: ShiftDay.TUESDAY },
  { name: "Wednesday", value: ShiftDay.WEDNESDAY },
  { name: "Thursday", value: ShiftDay.THURSDAY },
  { name: "Friday", value: ShiftDay.FRIDAY },
  { name: "Saturday", value: ShiftDay.SATURDAY },
  { name: "Sunday", value: ShiftDay.SUNDAY },
];
function addShift() {
  const shift = formatTimesInShift();
  shiftsStore.addShift(newShift.value);
  showAddShiftDialog.value = false;
  shiftsStore.getShifts();
}
function formatTimesInShift() {
  const shift = newShift.value;
  shift.shift_starting_date = `${newShiftDates.value.shift_starting_date.getFullYear()}-${newShiftDates.value.shift_starting_date.getMonth() + 1
    }-${newShiftDates.value.shift_starting_date.getDate()}`;
  shift.shift_starting_time = `${newShiftDates.value.shift_starting_time.getHours()}:${newShiftDates.value.shift_starting_time.getMinutes()}`;
  shift.shift_ending_date = newShiftDates.value.shift_ending_date
    ? `${newShiftDates.value.shift_ending_date?.getFullYear()}-${newShiftDates.value.shift_ending_date?.getMonth() + 1
    }-${newShiftDates.value.shift_ending_date?.getDate()}`
    : undefined;
  shift.shift_ending_time = `${newShiftDates.value.shift_ending_time.getHours()}:${newShiftDates.value.shift_ending_time.getMinutes()}`;
  return shift;
}

onMounted(() => {
  showAddShiftDialog.value = true;
});
</script>

<template>
  <PrimeDialog v-model:visible="showAddShiftDialog" :header="t('Add shift') + ' ' + newShift.shift_title" id="add-shift-dialog"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '50vw' }">
    <div class="dialog-content row">
      <div class="field">
        <label for="title">{{ t("Shift title") }}</label>
        <PrimeInputText id="title" type="text" v-model="newShift.shift_title" />
      </div>
      <div class="field col-12">
        <label for=" single">{{t("Shift type")}}</label>
        <PrimeSelectButton v-model="newShift.shift_type" :options="shiftTypeOptions" optionLabel="name"
          optionValue="value" dataKey="value" aria-labelledby="single" />
      </div>
      <div class="field col-12">
        <label for=" dateformat">{{t("Starting date")}}</label>
        <PrimeCalendar inputId="dateformat" v-model="newShiftDates.shift_starting_date" dateFormat="yy-mm-dd"
          :showIcon="true" />
      </div>
      <div class="field col-12">
        <label for=" dateformat">{{t("Ending date (optional)")}}</label>
        <PrimeCalendar inputId="dateformat" v-model="newShiftDates.shift_ending_date" dateFormat="yy-mm-dd"
          :showIcon="true" />
      </div>
      <div v-if="newShift.shift_type === 'repeating_monthly'" class="field col-12">
        <label for=" single">{{t("Shift week")}}</label>
        <PrimeSelectButton v-model="newShift.shift_week" :options="shiftWeekOptions" optionLabel="name"
          optionValue="value" dataKey="value" aria-labelledby="single" />
      </div>
      <div v-if="newShift.shift_type === 'repeating_monthly' || newShift.shift_type === 'repeating_weekly'"
        class="field col-12">
        <label for=" single">{{t("Shift day")}}</label>
        <PrimeSelectButton v-model="newShift.shift_day" :options="shiftDayOptions" optionLabel="name" optionValue="value"
          dataKey="value" aria-labelledby="single" />
      </div>
      <div class="field col-12">
        <label for=" time12">{{t("Starting Time")}}</label>
        <PrimeCalendar inputId="starting_time" v-model="newShiftDates.shift_starting_time" :timeOnly="true"
          hourFormat="24" />
      </div>
      <div  v-if="newShift.shift_type === 'repeating_monthly' || newShift.shift_type === 'repeating_weekly'" class="field col-12">
        <label for=" time12">{{t("Ending Time")}}</label>
        <PrimeCalendar inputId="ending_time" v-model="newShiftDates.shift_ending_time" :timeOnly="true" hourFormat="24" />
      </div>
      <div class="field col-12 md:col-4">
        <label for="time12">{{t("Required Members")}}</label>
        <PrimeInputNumber inputId="minmax" v-model="newShift.required_users" showButtons mode="decimal" :min="1"
          :max="100" />
      </div>
      <div class="field p-float-label">
        <PrimeTextarea id="additional_info" type="text" v-model="newShift.additional_info_general" />
        <label for="additional_info">{{
          t("Additional informations")
        }}</label>
      </div>
    </div>
    <template #footer>
      <PrimeButton :label="t('Reset')" icon="pi pi-times" @click="resetNewShift" class="p-button-danger" />
      <PrimeButton :label="t('Cancel')" icon="pi pi-times" @click="showAddShiftDialog = false" class="p-button-warning" />
      <PrimeButton :label="t('Add')" icon="pi pi-check" @click="addShift" autofocus class="p-button-success" />
    </template>
  </PrimeDialog>
</template>