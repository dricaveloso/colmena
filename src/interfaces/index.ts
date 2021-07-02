import { NotificationStatusProps } from "types";

export interface I18nInterface {
  locale: string;
}

export interface NotificationDataInterface {
  message: string;
  status: NotificationStatusProps;
}

export interface FileInterface {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
}
