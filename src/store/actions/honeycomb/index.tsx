import {
  SET_HONEYCOMBS,
  ADD_HONEYCOMB,
  EDIT_HONEYCOMB,
  REMOVE_HONEYCOMB,
  SET_CHAT_LIST,
  ADD_CHAT_MESSAGE,
} from "@/store/actions/index";
import { RoomItemInterface, ChatMessageItemInterface } from "@/interfaces/talk";

export const setHoneycombs = (honeycombs: Array<RoomItemInterface>) => ({
  type: SET_HONEYCOMBS,
  honeycombs,
});

export const addHoneycomb = (honeycomb: RoomItemInterface) => ({
  type: ADD_HONEYCOMB,
  honeycomb,
});

export const editHoneycomb = (honeycomb: RoomItemInterface) => ({
  type: EDIT_HONEYCOMB,
  honeycomb,
});

export const removeHoneycomb = (honeycomb: RoomItemInterface) => ({
  type: REMOVE_HONEYCOMB,
  honeycomb,
});

export const setChatList = (chatMessages: Array<ChatMessageItemInterface>) => ({
  type: SET_CHAT_LIST,
  chatMessages,
});

export const addChatMessage = (message: ChatMessageItemInterface) => ({
  type: ADD_CHAT_MESSAGE,
  message,
});
