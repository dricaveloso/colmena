/* eslint-disable camelcase */
// eslint-disable-next-line import/no-cycle
import { NotificationStatusProps, NXTagsProps, Environment, AllIconProps } from "@/types/index";
import React from "react";
import { ListTypeEnum } from "../enums";

export interface I18nInterface {
  locale: string;
}

export interface ConfigReduxInterface {
  currentPage: string;
  mutate: any;
}

export interface RecordingInterface {
  id: string;
  title?: string;
  arrayBufferBlob: ArrayBuffer;
  blob: Blob;
  audioUrl: string;
  tags: NXTagsProps[] | string[];
  audioType: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string | number;
}
export interface NotificationDataInterface {
  message: string;
  status: NotificationStatusProps;
}

export interface UserProfileInterface {
  medias: string[];
  avatar: string;
  social_medias: string[];
}

export interface MediaInfoInterface {
  name: string;
  logo?: string;
  url?: string;
  slogan?: string;
  groups?: string[];
  quota?: string;
  email?: string;
  social_medias?: [
    {
      name: string;
      url: string;
    },
  ];
}

export interface UserQuotaInterface {
  free: number;
  used: number;
  total: number;
  relative: number;
  quota: number;
}

export interface UserInfoInterface {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  lastLogin: number;
  password: string;
  language: string;
  website?: string;
  locale: string;
  twitter?: string;
  groups: string[];
  subadmin: string[];
  quota: UserQuotaInterface;
  media?: MediaInfoInterface;
}
export interface UserInfoUpdateInterface {
  name?: string;
  avatar?: string;
  email?: string;
  password?: string;
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

// export interface LibraryItemWebDavInterface {
//   basename: string;
//   filename: string;
//   type?: string;
//   size?: number;
//   lastmod?: string;
//   mime?: string;
// }
export interface LibraryItemWebDavInterface {
  filename: string;
  basename: string;
  type: string;
  size: number;
  lastmod: string;
}

export interface LibraryItemOCSUserInterface {
  id: string;
  address: string;
  displayname: string;
  email: string;
  enable: boolean;
  lastmod: string;
  language: string;
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
export interface LibraryInterface {
  listType?: ListTypeEnum;
  items?: LibraryItemInterface[];
  isLoading?: boolean;
  isDisabled?: boolean;
  options?: (
    cardItem: LibraryCardItemInterface,
    playButton?: React.ReactNode | undefined,
  ) => React.ReactNode;
  bottomOptions?: (
    cardItem: LibraryCardItemInterface,
    playButton?: React.ReactNode | undefined,
    badgeStatusGrid?: React.ReactNode | undefined,
  ) => React.ReactNode;
  handleItemClick: (item: LibraryItemInterface) => void;
}
export interface LibraryItemInterface {
  id: string;
  filename: string;
  aliasFilename: string;
  basename: string;
  extension?: string | undefined;
  type?: string;
  tags?: NXTagsProps[] | string[];
  arrayBufferBlob?: ArrayBuffer;
  updatedAt?: Date;
  createdAt?: Date;
  createdAtDescription?: string | undefined;
  environment: Environment;
  path?: string;
  image?: string;
  mime?: string;
  size?: number;
}

export interface LibraryCardItemInterface extends LibraryItemInterface {
  orientation: string | ["vertical", "horizontal"];
  options?: (
    item: LibraryItemInterface,
    playButton?: React.ReactNode | undefined,
  ) => React.ReactNode;
  bottomOptions?: (
    item: LibraryItemInterface,
    playButton?: React.ReactNode | undefined,
    badgeStatusGrid?: React.ReactNode | undefined,
  ) => React.ReactNode;
  handleOpenCard: (item: LibraryItemInterface) => void;
  isDisabled?: boolean;
}
export interface BreadcrumbItemInterface {
  description: string | undefined;
  path: string;
  isCurrent?: boolean;
  icon?: AllIconProps | undefined;
}

export interface TimeDescriptionInterface {
  singularYear: string;
  pluralYear: string;
  singularMonth: string;
  pluralMonth: string;
  singularHour: string;
  pluralHour: string;
  singularDay: string;
  pluralDay: string;
  singularMinute: string;
  pluralMinute: string;
  now: string;
}

export interface VerticalItemListInterface {
  avatar?: React.ReactElement;
  primary: string | React.ReactNode;
  secondary?: string | React.ReactNode;
  options?: React.ReactNode;
  isPlaying: boolean;
  handleClick?: (event: any) => void | undefined;
  filename: string;
  environment: Environment;
  size?: number;
}

export interface TagInterface {
  id: number;
  tag: string;
}
