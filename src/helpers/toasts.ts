import type { ToastServiceMethods } from "primevue/toastservice";

export function successToast(toast: any, message: String) {
  toast.add({
    severity: "success",
    summary: "Success",
    detail: message,
    life: 5000,
  });
}

export function errorToast(toast: any, e: any) {
  toast.add({
    severity: "error",
    summary: "Error",
    detail: `${JSON.stringify(e?.response?.data).substring(0, 200)} ...
     (Request ID: ${e?.response?.headers["x-request-id"]})`,
  });
}

export function toastify(
  toast: ToastServiceMethods,
  func: Function,
  args: any[]
): [any, any] {
  try {
    const response = func(...args);
    successToast(toast, "Success");
    return [response, null];
  } catch (e) {
    errorToast(toast, e);
    return [null, e];
  }
}
