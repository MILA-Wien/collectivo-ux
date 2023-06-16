import type { SchemaCondition } from "@/api/types";

// Check if a schema condition is true
export function checkCondition(
  object: any,
  condition: undefined | boolean | SchemaCondition
) {
  if (condition == null || condition == undefined) {
    return true;
  }
  if (typeof condition == "boolean") {
    return condition;
  }
  if (condition.condition == "not_empty") {
    if (object[condition.field]) {
      return true;
    } else {
      return false;
    }
  }
  if (condition.condition == "empty") {
    return !object[condition.field];
  }
  if (condition.condition == "equals" || condition.condition == "exact") {
    return object[condition.field] == condition.value;
  }
  console.log("Unknown condition: " + condition.condition);
  return false;
}
