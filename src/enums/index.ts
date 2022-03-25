export enum NotificationStatusEnum {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export enum ButtonColorEnum {
  DEFAULT = "default",
  INHERIT = "inherit",
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

export enum ButtonVariantEnum {
  CONTAINED = "contained",
  OUTLINED = "outlined",
  TEXT = "text",
}

export enum SelectVariantEnum {
  FILLED = "filled",
  OUTLINED = "outlined",
  STANDARD = "standard",
}

export enum ButtonSizeEnum {
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small",
}

export enum PositionEnum {
  FIXED = "fixed",
  ABSOLUTE = "absolute",
  STICKY = "sticky",
  STATIC = "static",
  RELATIVE = "relative",
}

export enum SizeScreensEnum {
  LG = "lg",
  MD = "md",
  SM = "sm",
  XL = "xl",
  XS = "xs",
}

export enum TextAlignEnum {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
  JUSTIFY = "justify",
  INHERIT = "inherit",
}

export enum TextColorEnum {
  INITIAL = "initial",
  INHERIT = "inherit",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TEXTPRIMARY = "textPrimary",
  TEXTSECONDARY = "textSecondary",
  ERROR = "error",
}

export enum TextDisplayEnum {
  INITIAL = "initial",
  BLOCK = "block",
  INLINE = "inline",
}

export enum TextVariantEnum {
  INHERIT = "inherit",
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  SUBTITLE1 = "subtitle1",
  SUBTITLE2 = "subtitle2",
  BODY1 = "body1",
  BODY2 = "body2",
  CAPTION = "caption",
  BUTTON = "button",
  OVERLINE = "overline",
  SRONLY = "srOnly",
  P = "p",
}

export enum AlignItemsEnum {
  STRETCH = "stretch",
  CENTER = "center",
  FLEXSTART = "flex-start",
  FLEXEND = "flex-end",
  BASELINE = "baseline",
  INITIAL = "initial",
  INHERIT = "inherit",
}

export enum JustifyContentEnum {
  FLEXSTART = "flex-start",
  FLEXEND = "flex-end",
  CENTER = "center",
  SPACEBETWEEN = "space-between",
  SPACEAROUND = "space-around",
  SPACEEVENLY = "space-evenly",
  INITIAL = "initial",
  INHERIT = "inherit",
}

export enum FlexDirectionEnum {
  ROW = "row",
  ROWREVERSE = "row-reverse",
  COLUMN = "column",
  COLUMNREVERSE = "column-reverse",
  INITIAL = "initial",
  INHERIT = "inherit",
}

export enum TextfieldVariantEnum {
  CONTAINED = "contained",
  OUTLINED = "outlined",
  TEXT = "text",
}

export enum EnvironmentEnum {
  LOCAL = "local",
  REMOTE = "remote",
  BOTH = "both",
}

export enum ListTypeEnum {
  LIST = "list",
  GRID = "grid",
}

export enum OrderEnum {
  ASC_ALPHABETICAL = "ascending_alphabetical_order",
  DESC_ALPHABETICAL = "descending_alphabetical_order",
  LATEST_FIRST = "latest_first",
  OLDEST_FIST = "oldest_first",
  HIGHLIGHT = "highlights",
}

export enum FilterEnum {
  ALL = "",
  OFFLINE = "offline",
  SYNC = "sync",
  AUDIO = "audio",
  IMAGE = "image",
  TEXT = "text",
}

export enum RoleUserEnum {
  COLLABORATOR = "collaborator",
  ADMIN = "admin",
}

export enum ConfigFilesNCEnum {
  USER_PROFILE = ".profile.json",
  MEDIA_PROFILE = ".media.cfg",
  MEDIA_PROFILE_AVATAR = ".avatar.jpg",
}

export enum ErrorAuthEnum {
  ERR001 = "ERR001",
  ERR002 = "ERR002",
  ERR003 = "ERR003",
}

export enum DefaultAudioTypeEnum {
  type = "opus",
}

export enum BadgeVariantEnum {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export enum DirectoryNamesNCEnum {
  TALK = "Talk",
}

export enum PermissionTalkMemberEnum {
  OWNER = 1,
  MODERATOR = 2,
  USER = 3,
  GUEST = 4,
  USER_PUBLIC_LINK = 5,
  GUEST_WITH_MODERATOR_PERMISSIONS = 6,
}

export enum ContextMenuEventEnum {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

export enum ContextMenuOptionEnum {
  EDIT = "edit",
  COPY = "copy",
  MOVE = "move",
  DUPLICATE = "duplicate",
  DOWNLOAD = "download",
  AVAILABLE_OFFLINE = "available_offline",
  RENAME = "rename",
  DETAILS = "details",
  PUBLISH = "publish",
  DELETE = "delete",
}

export enum HoneycombContextOptions {
  ADD_PARTICIPANT = "add-participant",
  LEAVE_CONVERSATION = "leave-conversation",
  REMOVE_CONVERSATION = "remove-conversation",
  ARCHIVE_CONVERSATION = "archive-conversation",
}

export enum TransferStatusEnum {
  PENDING = "pending",
  IN_PROGRESS = "in progress",
  COMPLETE = "complete",
  CANCELED = "canceled",
}

export enum TransferTypeEnum {
  UPLOAD = "upload",
  DOWNLOAD = "download",
}
