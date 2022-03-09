/* eslint-disable camelcase */
// eslint-disable-next-line import/no-cycle
import { NotificationStatusProps, NXTagsProps, Environment, AllIconProps } from "@/types/index";
import React from "react";
import { ContextMenuEventEnum, ContextMenuOptionEnum, ListTypeEnum } from "../enums";

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
  options?: (cardItem: LibraryCardItemInterface) => React.ReactNode;
  bottomOptions?: (
    cardItem: LibraryCardItemInterface,
    badgeStatusGrid?: React.ReactNode | undefined,
  ) => React.ReactNode;
  handleItemClick?: (item: LibraryItemInterface) => void;
  itemsQuantitySkeleton?: number;
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
  createdAt?: Date;
  createdAtDescription?: string | null;
  updatedAt?: Date;
  updatedAtDescription?: string | null;
  environment: Environment;
  path?: string;
  image?: string;
  mime?: string;
  size?: number;
  sizeFormatted?: string;
  contentLength?: number;
  ownerId?: string;
  ownerName?: string;
  title?: string;
  description?: string;
  language?: string;
  favorite?: number;
  commentsUnread?: number;
  fileId?: number;
  nextcloudId?: string;
  eTag?: string;
}

export interface LibraryCardItemInterface extends LibraryItemInterface {
  orientation: string | ["vertical", "horizontal"];
  options?: (item: LibraryItemInterface) => React.ReactNode;
  bottomOptions?: (
    item: LibraryItemInterface,
    badgeStatusGrid?: React.ReactNode | undefined,
  ) => React.ReactNode;
  handleOpenCard?: (item: LibraryItemInterface) => void;
  isDisabled?: boolean;
  subtitle?: string;
}

export interface LibraryItemContextMenuInterface extends LibraryItemInterface {
  availableOptions: Array<ContextMenuOptionEnum>;
  onChange: (
    cardItem: LibraryItemInterface,
    event: ContextMenuEventEnum,
    option: ContextMenuOptionEnum,
    extraInfo?: any,
  ) => void | Promise<void>;
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
  isPlaying?: boolean;
  handleClick?: (event: any) => void | undefined;
  filename: string;
  environment: Environment;
  size?: number;
  arrayBufferBlob?: ArrayBuffer | null;
  audioState?: "play" | "pause" | "stop";
  handleAudioFinish: () => void;
}

export interface TagInterface {
  id: number;
  tag: string;
}
