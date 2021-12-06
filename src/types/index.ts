// eslint-disable-next-line import/no-cycle
import { UserInfoInterface, RecordingInterface, LibraryItemInterface } from "@/interfaces/index";
import { ChatMessageItemInterface, RoomItemInterface } from "@/interfaces/talk";
import {
  NotificationStatusEnum,
  ButtonColorEnum,
  ButtonVariantEnum,
  ButtonSizeEnum,
  PositionEnum,
  SizeScreensEnum,
  SelectVariantEnum,
  TextAlignEnum,
  TextColorEnum,
  TextDisplayEnum,
  TextVariantEnum,
  AlignItemsEnum,
  JustifyContentEnum,
  FlexDirectionEnum,
  TextfieldVariantEnum,
  EnvironmentEnum,
} from "@/enums/index";

export type PropsUserSelector = {
  user: UserInfoInterface;
  invitationToken?: string | undefined;
};

export type PropsHoneycombSelector = {
  honeycombs: RoomItemInterface[];
  chatMessages: ChatMessageItemInterface[];
};

export type PropsConfigSelector = {
  currentPage: string;
};

export type PropsAudioData = {
  blob: Blob;
  blobUrl: string;
  type?: string;
};

export type PropsAudioSave = {
  name: string;
  tags: NXTagsProps[];
};

export type PropsLibrarySelector = {
  libraryFiles: LibraryItemInterface[];
  currentPath: string;
  currentPathExists: boolean;
};

export type NXTagsProps = {
  id: number;
  title: string;
};

export type SelectOptionItem = {
  id: number | string;
  value: string;
};

export type PropsRecordingSelector = {
  recordings: RecordingInterface[];
  activeRecordingState: string;
};

export type NotificationStatusProps =
  | NotificationStatusEnum.SUCCESS
  | NotificationStatusEnum.ERROR
  | NotificationStatusEnum.WARNING
  | NotificationStatusEnum.INFO;

export type ButtonColorProps =
  | ButtonColorEnum.DEFAULT
  | ButtonColorEnum.INHERIT
  | ButtonColorEnum.PRIMARY
  | ButtonColorEnum.SECONDARY;

export type ButtonVariantProps =
  | ButtonVariantEnum.CONTAINED
  | ButtonVariantEnum.OUTLINED
  | ButtonVariantEnum.TEXT;

export type SelectVariantProps =
  | SelectVariantEnum.FILLED
  | SelectVariantEnum.OUTLINED
  | SelectVariantEnum.STANDARD;

export type ButtonSizeProps = ButtonSizeEnum.LARGE | ButtonSizeEnum.MEDIUM | ButtonSizeEnum.SMALL;

export type PositionProps =
  | PositionEnum.FIXED
  | PositionEnum.ABSOLUTE
  | PositionEnum.STICKY
  | PositionEnum.STATIC
  | PositionEnum.RELATIVE;

export type SizeScreensProps =
  | SizeScreensEnum.LG
  | SizeScreensEnum.MD
  | SizeScreensEnum.SM
  | SizeScreensEnum.XL
  | SizeScreensEnum.XS;

export type TextAlignProps =
  | TextAlignEnum.LEFT
  | TextAlignEnum.RIGHT
  | TextAlignEnum.CENTER
  | TextAlignEnum.JUSTIFY
  | TextAlignEnum.INHERIT;

export type TextColorProps =
  | TextColorEnum.INITIAL
  | TextColorEnum.INHERIT
  | TextColorEnum.PRIMARY
  | TextColorEnum.SECONDARY
  | TextColorEnum.TEXTPRIMARY
  | TextColorEnum.TEXTSECONDARY
  | TextColorEnum.ERROR;

export type TextDisplayProps =
  | TextDisplayEnum.INITIAL
  | TextDisplayEnum.BLOCK
  | TextDisplayEnum.INLINE;

export type TextVariantProps =
  | TextVariantEnum.H1
  | TextVariantEnum.H2
  | TextVariantEnum.H3
  | TextVariantEnum.H4
  | TextVariantEnum.H5
  | TextVariantEnum.H6
  | TextVariantEnum.SUBTITLE1
  | TextVariantEnum.SUBTITLE2
  | TextVariantEnum.BODY1
  | TextVariantEnum.BODY2
  | TextVariantEnum.CAPTION
  | TextVariantEnum.BUTTON
  | TextVariantEnum.OVERLINE
  | TextVariantEnum.SRONLY
  | TextVariantEnum.INHERIT;

export type TextVariantMappingProps = {
  h1: TextVariantEnum.H1;
  h2: TextVariantEnum.H2;
  h3: TextVariantEnum.H3;
  h4: TextVariantEnum.H4;
  h5: TextVariantEnum.H5;
  h6: TextVariantEnum.H6;
  subtitle1: TextVariantEnum.H6;
  subtitle2: TextVariantEnum.H6;
  body1: TextVariantEnum.P;
  body2: TextVariantEnum.P;
};

export type FlexDirectionProps =
  | FlexDirectionEnum.ROW
  | FlexDirectionEnum.ROWREVERSE
  | FlexDirectionEnum.COLUMN
  | FlexDirectionEnum.COLUMNREVERSE
  | FlexDirectionEnum.INITIAL
  | FlexDirectionEnum.INHERIT;

export type AlignItemsProps =
  | AlignItemsEnum.STRETCH
  | AlignItemsEnum.CENTER
  | AlignItemsEnum.FLEXSTART
  | AlignItemsEnum.FLEXEND
  | AlignItemsEnum.BASELINE
  | AlignItemsEnum.INITIAL
  | AlignItemsEnum.INHERIT;

export type JustifyContentProps =
  | JustifyContentEnum.FLEXSTART
  | JustifyContentEnum.FLEXEND
  | JustifyContentEnum.CENTER
  | JustifyContentEnum.SPACEBETWEEN
  | JustifyContentEnum.SPACEAROUND
  | JustifyContentEnum.SPACEEVENLY
  | JustifyContentEnum.INITIAL
  | JustifyContentEnum.INHERIT;

export type TextfieldVariantProps =
  | TextfieldVariantEnum.CONTAINED
  | TextfieldVariantEnum.OUTLINED
  | TextfieldVariantEnum.TEXT;

export type FontSizeIconProps = "medium" | "inherit" | "large" | "small" | undefined;

export type AllIconProps =
  | "settings"
  | "edit"
  | "microphone"
  | "library"
  | "account_profile"
  | "world_map"
  | "home"
  | "cut"
  | "check_cloud"
  | "phone"
  | "off_cloud"
  | "more_vertical"
  | "search"
  | "equalize"
  | "back"
  | "language"
  | "share"
  | "add_user"
  | "dropdown_checklist"
  | "close"
  | "record"
  | "pause"
  | "stop"
  | "download"
  | "plus"
  | "arrow_right_up"
  | "burger_menu"
  | "global"
  | "download_circle"
  | "user_group"
  | "user"
  | "help"
  | "contract"
  | "info"
  | "panal"
  | "gradient_panal"
  | "logout"
  | "grid"
  | "settings_adjust"
  | "checklist"
  | "add_folder"
  | "clould_upload"
  | "info_circle"
  | "panal_flat"
  | "tick"
  | "chat"
  | "send"
  | "upload"
  | "edit_text"
  | "headphone"
  | "stream"
  | "audio_editor"
  | "clip"
  | "question"
  | "speaker"
  | "plus_circle"
  | "art_gallery"
  | "music"
  | "folder"
  | "private"
  | "offline"
  | "file"
  | "faq"
  | "warning";

export type Environment = EnvironmentEnum.LOCAL | EnvironmentEnum.REMOTE;
