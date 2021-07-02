import { NotificationStatusProps } from "types";

export interface I18nInterface {
  locale: string;
}

export interface NotificationDataInterface {
  message: string;
  status: NotificationStatusProps;
}

export interface UserInfoInterface {
  id: number;
  name: string;
  email: string;
  role: string;
  media: {
    id: number;
    name: string;
  };
}
export interface FileInterface {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
}
