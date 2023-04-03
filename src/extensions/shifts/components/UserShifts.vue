<script setup lang="ts">
import { useShiftsStore } from "@/stores/shifts";
import { ref, onMounted } from "vue";
import "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/vue3";

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
</script>

<template>
  <div class="user-shifts-wrapper">
    <FullCalendar :events="events" :options="options" />
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
