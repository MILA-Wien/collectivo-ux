<script setup lang="ts">
import PrimeDialog from "primevue/dialog";
import PrimeInputText from "primevue/inputtext";
import PrimeSelectButton from "primevue/selectbutton";
import PrimeCalendar from "primevue/calendar";
import PrimeTextarea from "primevue/textarea";
import PrimeButton from "primevue/button";
import PrimeInputNumber from "primevue/inputnumber";

import { useShiftsStore } from "@/stores/shifts";
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

const shiftTypeOptions = [
  { name: t("Regular"), value: ShiftType.REGULAR },
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
function formatTimesInShift() {
  const shift = editableShift.value;
  shift.shift_starting_date = `${editableShift.value.shift_starting_date.getFullYear()}-${
    editableShift.value.shift_starting_date.getMonth() + 1
  }-${editableShift.value.shift_starting_date.getDate()}`;
  shift.shift_starting_time = `${editableShift.value.shift_starting_time?.getHours()}:${editableShift.value.shift_starting_time.getMinutes()}`;
  shift.shift_ending_date = editableShift.value.shift_ending_date
    ? `${editableShift.value.shift_ending_date?.getFullYear()}-${
        editableShift.value.shift_ending_date?.getMonth() + 1
      }-${editableShift.value.shift_ending_date?.getDate()}`
    : undefined;
  shift.shift_ending_time = `${editableShift.value.shift_ending_time?.getHours()}:${editableShift.value.shift_ending_time.getMinutes()}`;
  return shift;
}
function saveShift() {
//   const shift = formatTimesInShift();
editableShift.value
  // console.log(shift);
  shiftsStore.updateShift(editableShift.value);
  showAddShiftDialog.value = false;
  shiftsStore.getShifts();
}
let props = defineProps<{
  shift: Shift;
}>();

let editableShift = ref<Shift>(props.shift);
onMounted(() => {
    showAddShiftDialog.value = true;
});
function addUser(){
    console.log("add user")
    alert("add user - not implemented yet")
}
function removeUser(){
    console.log("remove user")
    alert("remove user - not implemented yet")
}
</script>

<template>
    <PrimeDialog v-model:visible="showAddShiftDialog" :header="t('Edit shift')" id="add-shift-dialog"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '50vw' }">
        <div class="dialog-content row">
            <div class="field col-12">
                <label for="title">{{ t("title") }}</label>
                <PrimeInputText id="title" type="text" v-model="editableShift.shift_title" />
            </div>
            <div class="field col-12">
                <div class="col" v-if="editableShift.assigned_users>0">
                    <div v-for = "user in editableShift.assigned_users" :key="user.id">
                        <label for="title">{{ user.first_name }}</label>
                        <PrimeButton label="Remove" @click="removeUser">
                            <!-- icon for removing the user -->

                        </PrimeButton>
                    </div>
                </div>
                <div v-else>
                    <label for="title">{{ t("No users assigned") }}</label>
                </div>
            </div>
            <div class="field col-12">
                <PrimeButton label="Add users" @click="addUser"/>
            </div>
            <div class="field col-12">
                <label for=" single">Shift type</label>
                <PrimeSelectButton v-model="editableShift.shift_type" :options="shiftTypeOptions" optionLabel="name"
                    optionValue="value" dataKey="value" aria-labelledby="single" />
            </div>
            <div class="field col-12">
                <label for=" dateformat">Starting date</label>
                <PrimeCalendar inputId="dateformat" v-model="editableShift.shift_starting_date" dateFormat="yy-mm-dd"
                    :showIcon="true" />
            </div>
            <div class="field col-12">
                <label for=" dateformat">Ending date</label>
                <PrimeCalendar inputId="dateformat" v-model="editableShift.shift_ending_date" dateFormat="yy-mm-dd"
                    :showIcon="true" />
            </div>
            <div v-if="editableShift.shift_type === 'regular'" class="field col-12">
                <label for=" single">Shift week</label>
                <PrimeSelectButton v-model="editableShift.shift_week" :options="shiftWeekOptions" optionLabel="name"
                    optionValue="value" dataKey="value" aria-labelledby="single" />
            </div>
            <div v-if="editableShift.shift_type === 'regular'" class="field col-12">
                <label for=" single">Shift day</label>
                <PrimeSelectButton v-model="editableShift.shift_day" :options="shiftDayOptions" optionLabel="name"
                    optionValue="value" dataKey="value" aria-labelledby="single" />
            </div>
            <div class="field col-12">
                <label for=" time12">Starting Time</label>
                <PrimeCalendar inputId="starting_time" v-model="editableShift.shift_starting_time" :timeOnly="true"
                    hourFormat="24" />
            </div>
            <div class="field col-12">
                <label for=" time12">Ending Time</label>
                <PrimeCalendar inputId="ending_time" v-model="editableShift.shift_ending_time" :timeOnly="true"
                    hourFormat="24" />
            </div>
            <div class="field col-12 md:col-4">
                <label for="time12">Required Members</label>
                <PrimeInputNumber inputId="minmax" v-model="editableShift.required_users" showButtons mode="decimal" :min="1"
                    :max="100" />
            </div>
            <div class="field p-float-label">
                <PrimeTextarea id="additional_info" type="text" v-model="editableShift.additional_info_general" />
                <label for="additional_info">{{
                    t("Additional informations")
                }}</label>
            </div>
        </div>
        <template #footer>
            <div class="">
                <PrimeButton :label="t('Delete')" icon="pi pi-times" @click="deleteShift" class="p-button-danger" />
                <PrimeButton :label="t('Speichern')" icon="pi pi-check" @click="saveShift" autofocus class="p-button-success" />
            </div>
        </template>
    </PrimeDialog>
</template>