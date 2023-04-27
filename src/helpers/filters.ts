import { FilterMatchMode, FilterService } from "primevue/api";

function inListFilter(a: any, b: any) {
  if (a == undefined) {
    return false;
  }
  if (b == undefined) {
    return true;
  }
  const list: string[] = b.split(/;|,| /).map((s: any) => s.trim());
  return list.includes(a.toString());
}

FilterService.register("isNull", (a, b) => {
  console.log(a, b);
  if (b !== true) {
    return true;
  }
  return a == undefined || a == null || a == "";
});
FilterService.register("inList", (a, b) => inListFilter(a, b));
FilterService.register("notInList", (a, b) => !inListFilter(a, b));

// TODO: Implement not filters in backend first
export const matchModes: any = {
  text: [
    { label: "Contains", value: FilterMatchMode.CONTAINS },
    // { label: "Contains not", value: FilterMatchMode.NOT_CONTAINS },
    { label: "Starts With", value: FilterMatchMode.STARTS_WITH },
    // { label: "In List", value: "inList" },
    // { label: "Not In List", value: "notInList" },
    { label: "Is Empty", value: "isNull" },
  ],
  date: [
    { label: "Equals", value: FilterMatchMode.EQUALS },
    { label: "Before", value: FilterMatchMode.LESS_THAN },
    { label: "After", value: FilterMatchMode.GREATER_THAN },
    { label: "Is Empty", value: "isNull" },
  ],
  datetime: [
    { label: "Before", value: FilterMatchMode.LESS_THAN },
    { label: "After", value: FilterMatchMode.GREATER_THAN },
    { label: "Is Empty", value: "isNull" },
  ],
  multiselect: [
    // { label: "Contains", value: FilterMatchMode.CONTAINS },
    // { label: "Contains not", value: FilterMatchMode.NOT_CONTAINS },
    { label: "Includes", value: FilterMatchMode.EQUALS },
    // { label: "Is Empty", value: "isNull" },
  ],
  select: [
    { label: "Equals", value: FilterMatchMode.EQUALS },
    { label: "Is Empty", value: "isNull" },
  ],
  number: [
    { label: "In List", value: "inList" },
    // { label: "Not In List", value: "notInList" },
    { label: "Equals", value: FilterMatchMode.EQUALS },
    { label: "Less Than", value: FilterMatchMode.LESS_THAN },
    { label: "Greater Than", value: FilterMatchMode.GREATER_THAN },
    { label: "Is Empty", value: "isNull" },
  ],
};

export function getDefaultMatchMode(input_type: string) {
  if (matchModes[input_type]) {
    return matchModes[input_type][0].value;
  } else {
    return;
  }
}
