<script setup lang="ts">
import { useShiftsStore } from "@/stores/shifts";
import { ref, onMounted } from "vue";
import "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import PrimeButton from "primevue/button";
import PrimeDialog from "primevue/dialog";
import PrimeInputText from "primevue/inputtext";
import PrimeInputNumber from "primevue/inputnumber";
import PrimeCalendar from "primevue/calendar";
import PrimeSelectButton from "primevue/selectbutton";
import PrimeTextarea from "primevue/textarea";
import { useI18n } from "vue-i18n";
import { ShiftDay, ShiftType, ShiftWeek, type Shift } from "@/api/types";
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import 'primeflex/primeflex.css';

const { t } = useI18n();
const events = ref([
    {
        id: 'a',
        title: 'my event',
        start: new Date()
    }
]);

let options = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialDate: new Date(),
    headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: [],
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
});

const shiftsStore = useShiftsStore();
onMounted(() => {
    shiftsStore.getShifts();
});
const showAddShiftDialog = ref(false);
const today = new Date();
let todayLater = new Date();
todayLater.setHours(today.getHours() + 1);
const newShift = ref<Shift>({
    shift_title: "",
    shift_starting_date: today,
    shift_ending_date: "",
    shift_type: ShiftType.REGULAR,
    shift_week: ShiftWeek.A,
    shift_starting_time: today,
    shift_ending_time: todayLater,
    required_users: 1,
    shift_day: ShiftDay.MONDAY,
    additional_info_general: "",
})

const newShiftDates = ref({
    shift_starting_date: today,
    shift_ending_date: "",
    shift_starting_time: today,
    shift_ending_time: todayLater,
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
    // console.log(shift);
    newShift.value.shift_starting_time = null;
    newShift.value.shift_ending_time = null;
    newShift.value.shift_ending_date = null;
    shiftsStore.addShift(newShift.value);
    // showAddShiftDialog.value = false;
}
function formatTimesInShift() {
    console.log(newShift);
    const shift = newShift.value;
    shift.shift_starting_date = `${newShiftDates.value.shift_starting_date.getFullYear()}-${newShiftDates.value.shift_starting_date.getMonth() + 1}-${newShiftDates.value.shift_starting_date.getDate()}`;
    shift.shift_starting_time = `${newShiftDates.value.shift_starting_time.getHours()}:${newShiftDates.value.shift_starting_time.getMinutes()}`;
    shift.shift_ending_date = newShiftDates.value.shift_ending_date ? `${newShiftDates.value.shift_ending_date?.getFullYear()}-${newShiftDates.value.shift_ending_date?.getMonth() + 1}-${newShiftDates.value.shift_ending_date?.getDate()}` : "";
    shift.shift_ending_time = `${newShiftDates.value.shift_ending_time.getHours()}:${newShiftDates.value.shift_ending_time.getMinutes()}`;
    return shift;
}
function addEvent() {
    options.value.events.push({
        id: 'b',
        title: 'my event',
        start: new Date()
    })
}
const layout = ref('grid');
</script>

<template>
    <div>
        <PrimeButton label="Add event" icon="pi pi-plus" class="p-button-raised p-button-rounded p-button-success"
            @click="addEvent" />
        <PrimeButton label="Add Shift" icon="pi pi-plus" class="p-button-raised p-button-rounded p-button-success"
            @click="showAddShiftDialog = true" />

        <DataView :value="shiftsStore.shifts" paginator :rows="5" :sortOrder="sortOrder" :sortField="sortField"
            :layout="layout">
            <template #header>
                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By Price"
                    @change="onSortChange($event)" />
                <div class="flex justify-content-end">
                    <DataViewLayoutOptions v-model="layout" />
                </div>
            </template>
            <template #list="slotProps">
                {{ slotProps.data }}
                <div class="col-12">
                    <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                        <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                            :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
                            :alt="slotProps.data.shift_title" />
                        <div
                            class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                <div class="text-2xl font-bold text-900">{{ slotProps.data.name }}</div>
                                <Rating :modelValue="slotProps.data.rating" readonly :cancel="false"></Rating>
                                <div class="flex align-items-center gap-3">
                                    <span class="flex align-items-center gap-2">
                                        <i class="pi pi-tag"></i>
                                        <span class="font-semibold">{{ slotProps.data.category }}</span>
                                    </span>
                                    <Tag :value="slotProps.data.inventoryStatus">
                                        <!-- :severity="getSeverity(slotProps.data)"> -->
                                    </Tag>
                                </div>
                            </div>
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <span class="text-2xl font-semibold">${{ slotProps.data.price }}</span>
                                <Button icon="pi pi-shopping-cart" rounded
                                    :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #grid="slotProps">
                <div class="col-12 sm:col-6 lg:col-12 xl:col-2 p-2">
                    <div class="p-4 border-1 surface-border surface-card border-round">
                        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-tag"></i>
                                <span class="font-semibold">{{ slotProps.data.category }}</span>
                            </div>
                            <Tag :value="slotProps.data.inventoryStatus"></Tag>
                        </div>
                        <div class="flex flex-column align-items-center gap-3 py-5">
                            <img class="w-9 shadow-2 border-round"
                                :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
                                :alt="slotProps.data.name" />
                            <div class="text-2xl font-bold">{{ slotProps.data.name }}</div>
                            <Rating value="{product.rating}" readonly :cancel="false"></Rating>
                        </div>
                        <div class="flex align-items-center justify-content-between">
                            <span class="text-2xl font-semibold">${{ slotProps.data.price }}</span>
                            <Button icon="pi pi-shopping-cart" rounded
                                :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"></Button>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
        <PrimeDialog v-model:visible="showAddShiftDialog" :header="t('Add shift')" id="add-shift-dialog"
            :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '50vw' }">
            <div class="dialog-content row">
                <div class="field p-float-label">
                    <PrimeInputText id="title" type="text" v-model="newShift.shift_title" />
                    <label for="title">{{ t("title") }}</label>
                </div>
                <div class="field col-12 md:col-4">
                    <label for="single">Shift type</label>
                    <PrimeSelectButton v-model="newShift.shift_type" :options="shiftTypeOptions" optionLabel="name"
                        optionValue="value" dataKey="value" aria-labelledby="single" />
                </div>
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
                <div v-if="newShift.shift_type === 'regular'" class="field col-12 md:col-4">
                    <label for="single">Shift week</label>
                    <PrimeSelectButton v-model="newShift.shift_week" :options="shiftWeekOptions" optionLabel="name"
                        optionValue="value" dataKey="value" aria-labelledby="single" />
                </div>
                <div v-if="newShift.shift_type === 'regular'" class="field col-12 md:col-4">
                    <label for="single">Shift day</label>
                    <PrimeSelectButton v-model="newShift.shift_day" :options="shiftDayOptions" optionLabel="name"
                        optionValue="value" dataKey="value" aria-labelledby="single" />
                </div>
                <div class="field col-12 md:col-4">
                    <label for="time12">Starting Time</label>
                    <PrimeCalendar inputId="starting_time" v-model="newShiftDates.shift_starting_time" :timeOnly="true"
                        hourFormat="24" />
                </div>
                <div class="field col-12 md:col-4">
                    <label for="time12">Ending Time</label>
                    <PrimeCalendar inputId="ending_time" v-model="newShiftDates.shift_ending_time" :timeOnly="true"
                        hourFormat="24" />
                </div>
                <div class="field col-12 md:col-4">
                    <label for="time12">Required Members</label>
                    <PrimeInputNumber inputId="minmax" v-model="newShift.required_users" showButtons mode="decimal" :min="1"
                        :max="100" />
                </div>
                <div class="field p-float-label">
                    <PrimeTextarea id="additional_info" type="text" v-model="newShift.additional_info_general" />
                    <label for="additional_info">{{ t("Additional informations") }}</label>
                </div>
            </div>
            <template #footer>
                <PrimeButton :label="t('Reset')" icon="pi pi-times" @click="resetNewShift" class="p-button-danger" />
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
}

.field {
    margin-top: 10px;
    margin-right: 10px;
    font-weight: bold;
}
</style>
