<script setup lang="ts">
import { useShiftsStore } from "@/stores/shifts";
import { ref, onMounted } from "vue";
import "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/vue3";
import PrimeButton from "primevue/button";
import PrimeDialog from "primevue/dialog";
import PrimeInputText from "primevue/inputtext";
import PrimeInputNumber from "primevue/inputnumber";
import PrimeCalendar from "primevue/calendar";
import PrimeSelectButton from "primevue/selectbutton";
import PrimeTextarea from "primevue/textarea";
import { useI18n } from "vue-i18n";
import { ShiftDay, ShiftType, ShiftWeek, type Shift } from "@/api/types";

const { t } = useI18n();

const options = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialDate: "2017-02-01",
    headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
});
const events = ref(null);
const shiftsStore = useShiftsStore();
onMounted(() => {
    shiftsStore.getShifts();
});
const showAddShiftDialog = ref(false);
const newShift = ref<Shift>({
    shift_title: "",
    shift_starting_date: "",
    shift_ending_date: "",
    shift_type: ShiftType.REGULAR,
    shift_week: ShiftWeek.A,
    shift_starting_time: "",
    shift_ending_time: "",
    required_users: 1,
    shift_day: ShiftDay.MONDAY,
    additional_info_general: "",
})
const newShiftDates = ref({
    shift_starting_date: new Date(),
    shift_ending_date: new Date(),
    shift_starting_time: new Date(),
    shift_ending_time: new Date(),
});

function resetNewShift() {
    newShift.value = {
        shift_title: "",
        shift_starting_date: new Date(),
        shift_ending_date: "",
        shift_type: ShiftType.REGULAR,
        shift_week: ShiftWeek.A,
        shift_starting_time: "",
        shift_ending_time: "",
        required_users: 1,
        shift_day: ShiftDay.MONDAY,
        additional_info_general: "",
    };
}
const shiftTypeOptions = [
    { name: t("Regular"), value: ShiftType.REGULAR },
    { name: t("Extra"), value: ShiftType.EXTRA },
    { name: t("Holiday"), value: ShiftType.HOLIDAY },
    { name: t("On call irregular"), value: ShiftType.OTHER },
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
    // console.log(shift);
    shiftsStore.addShift(newShift.value);
    // showAddShiftDialog.value = false;
}
function formatTimesInShift() {
    console.log(newShift);
    const shift = newShift.value;
    shift.shift_starting_date = `${newShiftDates.value.shift_starting_date.getFullYear()}-${newShiftDates.value.shift_starting_date.getMonth() + 1}-${newShiftDates.value.shift_starting_date.getDate()}`; 
    shift.shift_starting_time = `${newShiftDates.value.shift_starting_time.getHours()}:${newShiftDates.value.shift_starting_time.getMinutes()}`; 
    shift.shift_ending_date = `${newShiftDates.value.shift_ending_date.getFullYear()}-${newShiftDates.value.shift_ending_date.getMonth() + 1}-${newShiftDates.value.shift_ending_date.getDate()}`;
    shift.shift_ending_time = `${newShiftDates.value.shift_ending_time.getHours()}:${newShiftDates.value.shift_ending_time.getMinutes()}`;
    return shift;
}
</script>

<template>
    <div>
        <PrimeButton label="Add Shift" icon="pi pi-plus" class="p-button-raised p-button-rounded p-button-success"
            @click="showAddShiftDialog = true" />
        <FullCalendar :events="events" :options="options" />
        <PrimeDialog v-model:visible="showAddShiftDialog" :header="t('Add shift')" id="add-shift-dialog"
            :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '50vw' }">
            <div class="dialog-content row">
                <span class="p-float-label">
                    <PrimeInputText id="title" type="text" v-model="newShift.shift_title" />
                    <label for="title">{{ t("title") }}</label>
                </span>
                <div class="field col-12 md:col-4">
                    <label for="dateformat">Starting date</label>
                    <PrimeCalendar inputId="dateformat" v-model="newShiftDates.shift_starting_date" dateFormat="yy-mm-dd"
                        :showIcon="true" />
                </div>
                <div class="field col-12 md:col-4">
                    <label for="dateformat">Ending date</label>
                    <PrimeCalendar inputId="dateformat" v-model="newShiftDates.shift_ending_date" dateFormat="yy-mm-dd"
                        :showIcon="true" />
                </div>
                <div>
                    <label for="single">Shift type</label>
                    <PrimeSelectButton v-model="newShift.shift_type" :options="shiftTypeOptions" optionLabel="name" optionValue="value"
                        dataKey="value" aria-labelledby="single" />
                </div>
                <div>
                    <label for="single">Shift week</label>
                    <PrimeSelectButton v-model="newShift.shift_week" :options="shiftWeekOptions" optionLabel="name" optionValue="value"
                        dataKey="value" aria-labelledby="single" />
                </div>
                <div class="field col-12 md:col-4">
                    <label for="time12">Starting Time</label>
                    <PrimeCalendar inputId="starting_time" v-model="newShiftDates.shift_starting_time" :timeOnly="true"
                        hourFormat="24" />
                </div>
                <div class="field col-12 md:col-4">
                    <label for="time12">Ending Time</label>
                    <PrimeCalendar inputId="ending_time" v-model="newShiftDates.shift_ending_time" :timeOnly="true" hourFormat="24" />
                </div>
                <div class="field col-12 md:col-4">
                    <label for="time12">Required Members</label>
                    <PrimeInputNumber inputId="minmax" v-model="newShift.required_users" showButtons mode="decimal" :min="1"
                        :max="100" />
                </div>
                <div>
                    <label for="single">Shift day</label>
                    <PrimeSelectButton v-model="newShift.shift_day" :options="shiftDayOptions" optionLabel="name" optionValue="value"
                        dataKey="value" aria-labelledby="single" />
                </div>
                <span class="p-float-label">
                    <PrimeTextarea id="additional_info" type="text" v-model="newShift.additional_info_general" />
                    <label for="additional_info">{{ t("Additional informations") }}</label>
                </span>
            </div>
            <template #footer>
                <PrimeButton :label="t('Reset')" icon="pi pi-times" @click="resetNewShift"
                    class="p-button-danger" />
                <PrimeButton :label="t('Cancel')" icon="pi pi-times" @click="showAddShiftDialog = false"
                    class="p-button-warning" />
                <PrimeButton :label="t('Add')" icon="pi pi-check" @click="addShift" autofocus class="p-button-success" />
            </template>
        </PrimeDialog>
    </div>
</template>

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
    background: #3bc2b4 !important;
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

.add-shift-dialog {
    width: 500px;
    max-width: 100vw;
}</style>
