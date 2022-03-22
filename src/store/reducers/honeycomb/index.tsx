import { RoomItemInterface, ChatMessageItemInterface } from "@/interfaces/talk";
import {
  SET_HONEYCOMBS,
  ADD_HONEYCOMB,
  EDIT_HONEYCOMB,
  REMOVE_HONEYCOMB,
  SET_CHAT_LIST,
  ADD_CHAT_MESSAGE,
  RELOAD_CHAT_LOCAL_MESSAGES,
  ADD_TOKEN_CHAT_CLEAR_MESSAGES,
} from "@/store/actions/index";

type initialStateProps = {
  honeycombs: RoomItemInterface[];
  clearChatMessages: string[];
  chatMessages: ChatMessageItemInterface[];
  reloadChatLocalMessage: boolean;
};

const myInitialState: initialStateProps = {
  honeycombs: [],
  clearChatMessages: [],
  chatMessages: [],
  reloadChatLocalMessage: false,
};

const reducer = (state = myInitialState, action: any) => {
  switch (action.type) {
    case SET_HONEYCOMBS: {
      let result = action.honeycombs;
      result = result.sort(
        (a: RoomItemInterface, b: RoomItemInterface) => b.lastActivity - a.lastActivity,
      );
      return { ...state, honeycombs: result };
    }
    case SET_CHAT_LIST:
      return { ...state, chatMessages: action.chatMessages };
    case ADD_HONEYCOMB:
      return { ...state, honeycombs: state.honeycombs.concat(action.honeycomb) };
    case ADD_TOKEN_CHAT_CLEAR_MESSAGES:
      return { ...state, clearChatMessages: state.clearChatMessages.concat(action.honeycomb) };
    case ADD_CHAT_MESSAGE:
      return { ...state, chatMessages: state.chatMessages.concat(action.message) };
    case EDIT_HONEYCOMB:
      // eslint-disable-next-line no-case-declarations
      const updatedHoneycomb = action.libraryFiles;
      updatedHoneycomb.map((item: RoomItemInterface) => {
        if (item.id === action.honeycomb.id) {
          return action.honeycomb;
        }

        return item;
      });
      return { ...state, honeycombs: updatedHoneycomb };
    case REMOVE_HONEYCOMB:
      return {
        ...state,
        honeycombs: state.honeycombs.filter(
          (item: RoomItemInterface) => item.id !== action.honeycomb.id,
        ),
      };
    case RELOAD_CHAT_LOCAL_MESSAGES:
      return {
        ...state,
        reloadChatLocalMessage: action.reload,
      };
    default:
      return state;
  }
};

export default reducer;
