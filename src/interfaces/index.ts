// eslint-disable-next-line import/no-cycle
import { NotificationStatusProps, NXTagsProps } from "@/types/index";

export interface I18nInterface {
  locale: string;
}

export interface RecordingInterface {
  id: string;
  title?: string;
  arrayBufferBlob: ArrayBuffer;
  blob: Blob;
  audioUrl: string;
  tags: NXTagsProps[];
  audioType: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string | number;
}
export interface NotificationDataInterface {
  message: string;
  status: NotificationStatusProps;
}

export interface MediaInfoInterface {
  name: string;
  logo: string;
  url: string;
  slogan: string;
}

export interface UserInfoInterface {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  userToken: string;
  language: string;
  website?: string;
  twitter?: string;
  groups: string[];
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

export interface LibraryItemWebDavInterface {
  basename: string;
  filename: string;
  type?: string;
  size?: number;
  lastmod: string;
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
