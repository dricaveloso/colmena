/* eslint-disable camelcase */
import { OCSMetaDefaultInterface, SWRDefaultOptionsInterface } from "./ocs";

export interface ShareItemInterface {
  id: number;
  share_type: number;
  uid_owner: string;
  displayname_owner: string;
  permissions: number;
  can_edit: boolean;
  can_delete: boolean;
  stime: number;
  parent: null | string;
  expiration: null | string;
  token: null | string;
  uid_file_owner: string;
  note: string;
  label: string;
  displayname_file_owner: string;
  path: string;
  item_type: string;
  mimetype: string;
  has_preview: boolean;
  storage_id: string;
  storage: number;
  item_source: number;
  file_source: number;
  file_parent: number;
  file_target: string;
  share_with: string;
  share_with_displayname: string;
  share_with_link: string;
  mail_send: number;
  hide_download: number;
}

export interface ShareCreateInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: ShareItemInterface;
    };
  };
}

export interface ShareResultInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: Array<ShareItemInterface>;
    };
  };
}
