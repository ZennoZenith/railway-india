export type ToastType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export type Toast = {
  id: string;
  toastType: ToastType;
  title: string;
  message: string;
};

export type DropDownListItem = {
  key: string;
  text: string;
  dataText: string;
};
