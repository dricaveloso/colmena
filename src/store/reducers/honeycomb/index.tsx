import { RoomItemInterface, ChatMessageItemInterface } from "@/interfaces/talk";
import {
  SET_HONEYCOMBS,
  ADD_HONEYCOMB,
  EDIT_HONEYCOMB,
  REMOVE_HONEYCOMB,
  SET_CHAT_LIST,
  ADD_CHAT_MESSAGE,
} from "@/store/actions/index";

type initialStateProps = {
  honeycombs: RoomItemInterface[];
  chatMessages: ChatMessageItemInterface[];
};

const initialState: initialStateProps = {
  honeycombs: [],
  chatMessages: [],
};

const reducer = (state = initialState, action: any) => {
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
    default:
      return state;
  }
};

export default reducer;
