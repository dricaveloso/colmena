// eslint-disable-next-line import/no-cycle
import { NotificationStatusProps, NXTagsProps } from "@/types/index";

export interface I18nInterface {
  locale: string;
}

export interface RecordingInterface {
  id: string;
  title?: string;
  url: string;
  blob: Blob;
  tags: NXTagsProps[];
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string | number;
}
export interface NotificationDataInterface {
  message: string;
  status: NotificationStatusProps;
}

export interface MediaInfoInterface {
  id: number;
  name: string;
  image?: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfoInterface {
  id: number;
  name: string;
  photo?: string;
  email: string;
  accessToken: string;
  language: string;
  url?: string;
  role: string;
  media: MediaInfoInterface;
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

export interface UserInvitationInterface {
  username: string;
  name?: string;
  sub: number;
  role: string;
  media: {
    id: number;
    name: string;
    description: string;
    image: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  iat: number;
  exp: number;
}
