export const successToast = (toast: any, message: String) => {
  toast.add({
    severity: "success",
    summary: "Success",
    detail: message,
    life: 5000,
  });
};

export const errorToast = (toast: any, e: any) => {
  toast.add({
    severity: "error",
    summary: "Error",
    detail: `Update failed. Request-id: "${e?.response?.headers["x-request-id"]}
        " Response: "${JSON.stringify(e?.response?.data)}"`,
  });
};
