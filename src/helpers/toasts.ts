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
  try {
    const data = e?.response?.data;
    // Create seperate toasts for each error message
    if (typeof data === "object") {
      for (const key in data) {
        if (Array.isArray(data[key])) {
          for (const item of data[key]) {
            toast.add({
              severity: "warn",
              summary: key,
              detail: JSON.stringify(item).substring(0, 200),
            });
          }
        } else {
          toast.add({
            severity: "warn",
            summary: key,
            detail: JSON.stringify(data[key]).substring(0, 200),
          });
        }
      }
    } else {
      // Increased severity if error data is not an object
      toast.add({
        severity: "error",
        summary: "Error",
        detail: JSON.stringify(data).substring(0, 200),
      });
    }
    // Add request ID if available
    const requestID = e?.response?.headers["x-request-id"];
    if (requestID) {
      toast.add({
        severity: "info",
        summary: "Request ID",
        detail: requestID,
      });
    }
  } catch {
    console.log(e);
    toast.add({
      severity: "error",
      summary: "Error",
    });
  }
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
