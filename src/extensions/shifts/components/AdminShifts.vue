<script setup lang="ts">
import { useShiftsStore } from "../stores/shifts";
import { ref, onMounted } from "vue";
import "@fullcalendar/core";
import PrimeButton from "primevue/button";
import { useI18n } from "vue-i18n";
import type { Shift } from "@/api/types";
import DataView from "primevue/dataview";
import TabView from "primevue/tabview";
import PrimeTag from "primevue/tag";
import TabPanel from "primevue/tabpanel";
import PrimeCard from "primevue/card";
import PrimeRating from "primevue/rating";
import PrimeDropdown from "primevue/dropdown";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import Timeline from "primevue/timeline";
import "primeflex/primeflex.css";
import PrimeScrollTop from "primevue/scrolltop";

import PrimeChip from "primevue/chip";

import PrimeVirtualScroller from "primevue/virtualscroller";
import AdminShiftDetail from "./AdminShiftDetail.vue";
import AdminShiftNew from "./AdminShiftNew.vue";

import { getColorForWeek } from "@/helpers/shifts";
import { useMenuStore } from "@/stores/menu";

const menuStore = useMenuStore();
menuStore.setTitle("Admin Shifts");
const { t } = useI18n();

const shiftsStore = useShiftsStore();
onMounted(() => {
  shiftsStore.getShifts();
});
const showAddShiftDialog = ref(false);
const openShfiftDetailsActive = ref(false);

const layout = ref("list");
const sortField = ref("");
const sortOptions = ref([
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "D", value: "D" },
]);
const sortKey = ref("");
const sortOrder = ref(1);
let lastKnownScrollPosition = 0;

document
  .getElementsByTagName("main")[0]
  .addEventListener("scroll", (event: any) => {
    lastKnownScrollPosition = event.target.scrollTop;
    if (lastKnownScrollPosition > 150) {
      document.getElementById("date-menu")?.classList.add("fixed");
    } else {
      document.getElementById("date-menu")?.classList.remove("fixed");
    }
  });
const selectedShift = ref<Shift>();
function openShfiftDetail(shift: Shift) {
  openShfiftDetailsActive.value = true;
  selectedShift.value = shift;
}

function onSortChange() {
  console.log("sort change todo");
}
const shiftTypeSortOptions = ref([]);
</script>

<template>
  <div class="admin-shifts" id="admin-shifts">
    <PrimeButton
      label="Add Shift"
      icon="pi pi-plus"
      class="p-button-raised p-button-rounded p-button-success"
      @click="showAddShiftDialog = true"
    />
    <TabView>
      <TabPanel header="Timeline" lazy="true">
        <div class="grid">
          <div class="col-9">
            <Timeline
              :value="shiftsStore.sortedShifts"
              align="left"
              class="shifts-timeline"
              v-if="shiftsStore.shifts?.length > 0"
            >
              <template #marker="slotProps">
                <span
                  class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                  :style="{
                    backgroundColor: getColorForWeek(
                      slotProps.item.shifts[0]?.shift_week
                    ),
                  }"
                >
                  {{ slotProps.item.shifts[0]?.shift_week }}
                </span>
              </template>
              <template #opposite="slotProps">
                <div :id="slotProps.item.date">{{ slotProps.item.date }}</div>
              </template>
              <template #content="slotProps">
                {{ t(slotProps.item.shifts[0]?.shift_day) }}
                <div class="grid">
                  <div
                    v-for="shift in slotProps.item.shifts"
                    :key="shift.id"
                    class="col-4 p-2"
                  >
                    <PrimeCard
                      @click="openShfiftDetail(shift)"
                      class="shift-card"
                    >
                      <template #title>
                        <div class="text-base">
                          {{ shift.shift_title }} -
                          {{ shift.shift_starting_time.substring(0, 5) }} -
                          {{ shift.shift_ending_time.substring(0, 5) }}
                        </div>
                      </template>
                      <template #subtitle>
                        <PrimeChip :label="t(shift.shift_type)" />
                        <PrimeRating
                          v-model="shift.assigned_users.length"
                          :cancel="false"
                          :stars="shift.assignments.length"
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
                      </template>
                      <template #content>
                        {{ shift.additional_info_general }}
                      </template>
                    </PrimeCard>
                  </div>
                </div>
              </template>
            </Timeline>
          </div>
          <div class="col-3 flex justify-content-end" :size="25">
            <div id="date-menu">
              <PrimeVirtualScroller
                :items="shiftsStore.sortedShifts"
                :itemSize="50"
                class="border-1 surface-border border-round"
                style="width: 200px; height: 200px"
              >
                <template v-slot:item="{ item, options }">
                  <div
                    :class="[
                      'flex align-items-center p-2',
                      { 'surface-hover': options.odd },
                    ]"
                    style="height: 50px"
                  >
                    <a :href="`#${item.date}`">{{ item.date }} </a>
                  </div>
                </template>
              </PrimeVirtualScroller>
            </div>
          </div>
        </div>

        <PrimeScrollTop />
      </TabPanel>
      <TabPanel header="Data View">
        <DataView
          :value="shiftsStore.shifts"
          paginator
          :rows="20"
          :sortOrder="sortOrder"
          :sortField="sortField"
          :data-key="sortKey"
          :layout="layout"
        >
          <template #header>
            <PrimeDropdown
              v-model="sortKey"
              :options="shiftTypeSortOptions"
              optionLabel="label"
              :placeholder="t('Sort by shift type')"
              @change="onSortChange($event)"
            />
            <!-- Todo Sort only by week, when shift type is monthly -->
            <PrimeDropdown
              v-model="sortKey"
              :options="sortOptions"
              optionLabel="label"
              :placeholder="t('Sort by repeating week')"
              @change="onSortChange($event)"
            />
            <div class="flex justify-content-end">
              <DataViewLayoutOptions v-model="layout" />
            </div>
          </template>
          <template #list="slotProps">
            <div class="col-12">
              <div
                class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4"
              >
                <b
                  class="list-week p-button"
                  :style="{
                    backgroundColor: getColorForWeek(slotProps.data.shift_week),
                  }"
                  >{{ slotProps.data.shift_week }}</b
                >
                <div
                  class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4"
                >
                  <div
                    class="flex flex-row align-items-center sm:align-items-start gap-3"
                  >
                    <div class="text-2xl font-bold text-900">
                      {{ slotProps.data.shift_title }}
                    </div>
                    <div class="font-bold text-900">
                      {{
                        `${
                          slotProps.data.shift_starting_date
                        } ${slotProps.data.shift_starting_time.substring(
                          0,
                          5
                        )} -
                                            ${slotProps.data.shift_ending_time.substring(
                                              0,
                                              5
                                            )}`
                      }}
                    </div>
                    <PrimeRating
                      v-model="slotProps.data.assigned_users.length"
                      :cancel="false"
                      :stars="slotProps.data.assignments.length"
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
                  </div>
                  <div
                    class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2"
                  >
                    <PrimeButton
                      icon="pi pi-cog"
                      rounded
                      @click="openShfiftDetail(slotProps.data)"
                    ></PrimeButton>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #grid="slotProps">
            <div class="col-12 sm:col-6 lg:col-12 xl:col-2 p-2">
              <div
                class="p-4 border-1 surface-border surface-card border-round"
              >
                <div
                  class="flex flex-wrap align-items-center justify-content-between gap-2"
                >
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-tag"></i>
                    <span class="font-semibold">{{
                      slotProps.data.category
                    }}</span>
                  </div>
                  <PrimeTag :value="slotProps.data.inventoryStatus"></PrimeTag>
                </div>
                <div class="flex flex-column align-items-center gap-3 py-5">
                  <img
                    class="w-9 shadow-2 border-round"
                    :src="`${slotProps.data.image}`"
                    :alt="slotProps.data.name"
                  />
                  <div class="text-2xl font-bold">
                    {{ slotProps.data.name }}
                  </div>
                  <PrimeRating
                    value="{product.rating}"
                    readonly
                    :cancel="false"
                  ></PrimeRating>
                </div>
                <div class="flex align-items-center justify-content-between">
                  <span class="text-2xl font-semibold"
                    >${{ slotProps.data.price }}</span
                  >
                  <PrimeButton
                    icon="pi pi-shopping-cart"
                    rounded
                    :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"
                  ></PrimeButton>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </TabPanel>
    </TabView>
    <AdminShiftNew
      v-if="showAddShiftDialog"
      @update:visible="showAddShiftDialog = $event"
    />
    <AdminShiftDetail
      v-if="openShfiftDetailsActive"
      :shift="selectedShift"
      @update:visible="openShfiftDetailsActive = $event"
    />
  </div>
</template>

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

.shifts-timeline .p-timeline-event-opposite {
  max-width: 100px;
  padding-right: 20px;
}

.admin-shifts {
  position: relative;
}

.fixed {
  position: fixed;
  top: 1;
  right: 40;
}

.shift-card {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
  }
}
</style>
