import { defineStore } from "pinia";
import { API } from "@/api/api";
import { formatDate } from "@/helpers/shifts";
import type { Shift, ShiftAssignment, ShiftsList } from "@/api/types";

export type ShiftsStoreState = {
  assignments: any;
  shifts: Array<ShiftsList>;
  sortedShifts: Array<ShiftsList>;
  selfShifts: Array<ShiftsList>;
  openShifts: Array<ShiftsList>;
  selfProfile: any;
};

export const useShiftsStore = defineStore({
  id: "shifts",
  state: () =>
    ({
      assignments: [],
      shifts: [],
      sortedShifts: [],
      selfShifts: [],
      openShifts: [],
      selfProfile: {},
    } as ShiftsStoreState),

  actions: {
    async getShifts() {
      const todayDate = new Date();
      const endOfMonth = formatDate(
        new Date(todayDate.getFullYear(), todayDate.getMonth() + 2, 0)
      );
      const startOfMonth = formatDate(
        new Date(todayDate.getFullYear(), todayDate.getMonth(), 0)
      );
      API.getWithParams("shiftsShifts", {
        shift_starting_date__gte: startOfMonth,
        shift_starting_date__lte: endOfMonth,
      }).then((response) => {
        this.shifts = response.data;
        this.sortedShifts = this.sortShiftsByDate(this.shifts);
        return response.data;
      });
    },
    async getAssignments() {
      API.get("shiftsAssignments").then((response) => {
        this.assignments = response.data;
        return response.data;
      });
    },
    async getShiftsForSelf() {
      this.selfShifts = [];
      API.get("shiftsShiftsSelf").then((response) => {
        console.log(response.data);
        this.selfShifts = this.sortShiftsByDate(response.data.results);
        return response.data;
      });
    },
    async getSelfProfile() {
      API.get("shiftsShiftsUserSelf").then((response) => {
        if (response.data.results.length > 0) {
          this.selfProfile = response.data.results[0];
          return response.data;
        }
      });
    },
    async getOpenShifts() {
      this.openShifts = [];
      const todayDate = new Date();
      const endOfMonth = formatDate(
        new Date(todayDate.getFullYear(), todayDate.getMonth() + 2, 0)
      );
      const startOfMonth = formatDate(
        new Date(todayDate.getFullYear(), todayDate.getMonth(), 0)
      );
      API.getWithParams("shiftsOpenShifts", {
        shift_starting_date__gte: startOfMonth,
        shift_starting_date__lte: endOfMonth,
      }).then((response) => {
        let openShifts = response.data;
        openShifts = openShifts.filter((shift: any) => {
          return (
            shift.assigned_users.length < shift.required_users &&
            shift.shift_type !== "holiday" &&
            shift.assigned_users.filter(
              (user: any) => user.id === this.selfProfile.id
            ).length === 0
          );
        });
        this.openShifts = this.sortShiftsByDate(openShifts);
        return response.data;
      });
    },
    sortShiftsByDate(shifts: Array<ShiftsList>) {
      const shiftsByDate = shifts.sort((a: any, b: any) => {
        return new Date(a.shift_starting_date) > new Date(b.shift_starting_date)
          ? 1
          : -1;
      });
      const shiftsGroupedByDate: Array<any> = [];
      shiftsByDate.forEach((element: any) => {
        const date = element.shift_starting_date;
        const index = shiftsGroupedByDate.findIndex(
          (e: any) => e.date === date
        );
        if (index === -1) {
          shiftsGroupedByDate.push({
            date: date,
            shifts: [element],
          });
        } else {
          shiftsGroupedByDate[index].shifts.push(element);
        }
      });
      return shiftsGroupedByDate;
    },
    async addShift(shift: Shift) {
      return API.post("shiftsShifts", shift);
    },
    async updateShift(shift: Shift) {
      return API.patch("shiftsShifts", shift, shift.id);
    },
    async deleteShift(shift: Shift) {
      if (shift.id) return API.delete("shiftsShifts", shift.id);
    },
    async assignShift(shifts: any) {
      const assignment: ShiftAssignment = {
        assigned_user: this.selfProfile.user,
        shift: shifts.shifts[0].id,
        attending: false,
        additional_info_individual: " ",
      };
      console.log(assignment, this.selfProfile);
      return API.post("shiftsAssignments", assignment);
    },
  },
  getters: {},
});
