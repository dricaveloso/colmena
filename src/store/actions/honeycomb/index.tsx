import {
  SET_HONEYCOMBS,
  ADD_HONEYCOMB,
  EDIT_HONEYCOMB,
  REMOVE_HONEYCOMB,
  SET_CHAT_LIST,
  ADD_CHAT_MESSAGE,
  RELOAD_CHAT_LOCAL_MESSAGES,
  ADD_TOKEN_CHAT_CLEAR_MESSAGES,
  ADD_TOKEN_HONEYCOMB_ARCHIVED,
  REMOVE_TOKEN_HONEYCOMB_ARCHIVED,
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

export const addHoneycombArchived = (honeycomb: string) => ({
  type: ADD_TOKEN_HONEYCOMB_ARCHIVED,
  honeycomb,
});

export const removeHoneycombArchived = (honeycomb: string) => ({
  type: REMOVE_TOKEN_HONEYCOMB_ARCHIVED,
  honeycomb,
});

export const addClearHoneycombChatMessages = (honeycomb: string) => ({
  type: ADD_TOKEN_CHAT_CLEAR_MESSAGES,
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

export const reloadChatLocalMessages = (reload: boolean) => ({
  type: RELOAD_CHAT_LOCAL_MESSAGES,
  reload,
});
