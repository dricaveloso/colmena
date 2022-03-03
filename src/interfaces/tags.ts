export interface SystemTagsInterface {
  href: string;
  propstat: {
    prop: SystemTagsPropInterface;
  };
}

export interface SystemTagsPropInterface {
  "display-name"?: string;
  "user-visible"?: string;
  "user-assignable"?: string;
  id?: string;
}

export interface TagInterface {
  tagId: number | string;
  tagName: string;
  fileId: number | string;
  fileName: string;
  baseName: string;
  quantity?: number;
}
