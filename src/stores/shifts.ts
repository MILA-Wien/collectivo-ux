import { defineStore } from "pinia";
import { API } from "@/api/api";

export type ShiftsStoreState = {
  assignments: any;
  shifts: any;
  sortedShifts: any;
};

export const useShiftsStore = defineStore({
  id: "shifts",
  state: () =>
  ({
    assignments: {},
    shifts: {},
  } as ShiftsStoreState),

  actions: {
    async getShifts() {
      const todayDate = new Date();
      const today = formatDate(todayDate);
      const endOfMonth = formatDate(
        new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0)
      );
      const startOfMonth = formatDate(
        new Date(todayDate.getFullYear(), todayDate.getMonth(), 0)
      );
      API.getWithParams("shiftsShifts", {
        shift_starting_date__gte: startOfMonth,
        shift_starting_date__lte: endOfMonth,
      }).then((response) => {
        this.shifts = response.data;
        this.sortShiftsByDate();
        return response.data;
      });
    },
    async sortShiftsByDate() {
      console.log("now")
      const shiftsByDate = this.shifts.sort((a: any, b: any) => {
        return new Date(a.shift_starting_date) > new Date(b.shift_starting_date)
          ? 1
          : -1;
      });
      const shiftsGroupedByDate: Array<any> = [];
      shiftsByDate.forEach((element: any) => {
        const date = element.shift_starting_date;
        const index = shiftsGroupedByDate.findIndex((e: any) => e.date === date);
        if (index === -1) {
          shiftsGroupedByDate.push({
            date: date,
            shifts: [element],
          });
        } else {
          shiftsGroupedByDate[index].shifts.push(element);
        }
      });

      this.sortedShifts = shiftsGroupedByDate;
      console.log(shiftsGroupedByDate);
    },
    async addShift(shift: any) {
      return API.post("shiftsShifts", shift);
    },
  },
  getters: {},
});

function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1; // Months start at 0!
  const dd = date.getDate();
  let mm_formated = mm.toString();
  let dd_formated = dd.toString();
  if (dd < 10) dd_formated = "0" + dd;
  if (mm < 10) mm_formated = "0" + mm;

  return yyyy + "-" + mm_formated + "-" + dd_formated;
}
