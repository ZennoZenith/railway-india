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

export type DocumentationMeta = {
  title: string;
  description: string;
  outline?: string;
  lastUpdated?: boolean;
  editLink?: boolean;
  lang?: string;
  prev?: {
    text: string;
    link: string;
  };
  next?: {
    text: string;
    link: string;
  };
};

export type Links = {
  text: string;
  link?: string;
  items?: Links[];
};

export type Aside = {
  title: string;
  links: Links[];
};
