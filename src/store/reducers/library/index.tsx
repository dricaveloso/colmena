import { LibraryItemInterface } from "@/interfaces/index";
import {
  SET_LIBRARY_FILES,
  ADD_LIBRARY_FILE,
  EDIT_LIBRARY_FILE,
  REMOVE_LIBRARY_FILE,
  SET_LIBRARY_PATH_EXISTS,
  SET_LIBRARY_PATH,
  CURRENT_AUDIO_PLAYING,
} from "@/store/actions/index";

type initialStateProps = {
  libraryFiles: LibraryItemInterface[];
  currentPath: string;
  currentPathExists: boolean;
  currentAudioPlaying: string;
};

const initialState: initialStateProps = {
  libraryFiles: [],
  currentPath: "/",
  currentPathExists: true,
  currentAudioPlaying: "",
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_LIBRARY_FILES:
      return { ...state, libraryFiles: action.libraryFiles };
    case ADD_LIBRARY_FILE:
      return { ...state, libraryFiles: state.libraryFiles.concat(action.libraryFile) };
    case EDIT_LIBRARY_FILE:
      // eslint-disable-next-line no-case-declarations
      const updatedLibrary: LibraryItemInterface[] = state.libraryFiles.map(
        (item: LibraryItemInterface) => {
          if (item.id === action.id) {
            return { ...item, ...action.libraryFile };
          }

          return item;
        },
      );
      return { ...state, libraryFiles: updatedLibrary };
    case REMOVE_LIBRARY_FILE:
      return {
        ...state,
        libraryFiles: state.libraryFiles.filter(
          (item: LibraryItemInterface) => item.id !== action.id,
        ),
      };
    case SET_LIBRARY_PATH_EXISTS:
      return { ...state, currentPathExists: action.pathExists };
    case CURRENT_AUDIO_PLAYING:
      return { ...state, currentAudioPlaying: action.filename };
    case SET_LIBRARY_PATH:
      return { ...state, currentPath: action.path };
    default:
      return state;
  }
};

export default reducer;
