import { OCSMetaDefaultInterface, SWRDefaultOptionsInterface } from "./ocs";

export interface RoomItemInterface {
  id: number;
  token: string;
  type: number;
  name: string;
  displayName: string;
  objectType: string;
  objectId: string;
  participantType: number;
  participantFlags: number;
  readOnly: number;
  hasPassword: boolean;
  hasCall: boolean;
  canStartCall: boolean;
  lastActivity: number;
  lastReadMessage: number;
  unreadMessages: number;
  unreadMention: boolean;
  isFavorite: boolean;
  canLeaveConversation: boolean;
  canDeleteConversation: boolean;
  notificationLevel: number;
  lobbyState: number;
  lobbyTimer: number;
  lastPing: number;
  sessionId: string;
  guestList: string;
  lastMessage: {
    id: number;
    token: string;
    actorType: string;
    actorId: string;
    actorDisplayName: string;
    timestamp: number;
    message: string;
    messageParameters: ChatMessageItemMessageParameterInterface;
    systemMessage: string;
    messageType: string;
    isReplyable: boolean;
    referenceId: string;
  };
  sipEnabled: number;
  actorType: string;
  actorId: string;
  attendeeId: number;
  canEnableSIP: boolean;
  attendeePin: string;
  description: string;
  lastCommonReadMessage: number;
  listable: number;
  callFlag: number;
}

export interface RoomListInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: RoomItemInterface[];
    };
  };
}

export interface RoomCreateInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: RoomItemInterface;
    };
  };
}
export interface ParticipantCreateInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: [];
    };
  };
}

export interface RoomInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: RoomItemInterface;
    };
  };
}

export interface RoomParticipant {
  inCall: number;
  lastPing: number;
  sessionId: number;
  participantType: number;
  attendeeId: number;
  actorId: string;
  actorType: string;
  attendeePin: string;
  displayName: string;
}

export interface RoomParticipantsInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: RoomParticipant[];
    };
  };
}

export interface ReadOnlyRoomInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: string[];
    };
  };
}

export interface ChatMessageItemMessageParameterInterface {
  actor: {
    type: string;
    id: string;
    name: string;
  };
  user?: {
    type: string;
    id: string;
    name: string;
  };
}

export interface ChatMessageItemInterface {
  id?: number;
  token?: string;
  actorType: string;
  actorId: string;
  actorDisplayName: string;
  timestamp: number;
  message: string;
  messageParameters?: ChatMessageItemMessageParameterInterface;
  systemMessage: string;
  messageType: string;
  isReplyable?: boolean;
  referenceId?: string;
}
export interface ChatMessagesListInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: ChatMessageItemInterface[];
    };
  };
}
export interface CreateNewConversationInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: {
        roomType: number;
        roomName: string;
      };
    };
  };
}
export interface AddParticipantConversationInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: {
        newParticipant: string;
        source: string;
      };
    };
  };
}

export interface ChatMessagesCreateInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: ChatMessageItemInterface;
    };
  };
}

export interface AllowedGuestsConversationInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: {
        state: number;
      };
    };
  };
}
