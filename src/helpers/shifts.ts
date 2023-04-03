import { ShiftWeek } from "@/api/types";


export function getColorForWeek(week: ShiftWeek) {
    switch (week) {
      case ShiftWeek.A:
        return "#FFC107";
      case ShiftWeek.B:
        return "#FF5722";
      case ShiftWeek.C:
        return "#673AB7";
      case ShiftWeek.D:
        return "#009688";
      default:
        return "#FFC107";
    }
  }