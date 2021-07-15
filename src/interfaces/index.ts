import { NotificationStatusProps } from "@/types/index";

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
  avatar?: string;
  language?: string;
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

export interface GenericHorizontalItemInterface {
  id?: number;
  srcImg: string;
  title: string;
  subtitle: string;
  url: string;
}

export interface LibraryItemInterface {
  id: number;
  title: string;
  subtitle?: string;
  img?: string;
  url?: string;
}
