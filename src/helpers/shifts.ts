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

export function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1; // Months start at 0!
  const dd = date.getDate();
  let mm_formated = mm.toString();
  let dd_formated = dd.toString();
  if (dd < 10) dd_formated = "0" + dd;
  if (mm < 10) mm_formated = "0" + mm;

  return yyyy + "-" + mm_formated + "-" + dd_formated;
}
