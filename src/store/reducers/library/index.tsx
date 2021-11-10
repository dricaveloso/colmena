import { LibraryItemInterface } from "@/interfaces/index";
import {
  SET_LIBRARY_FILES,
  ADD_LIBRARY_FILE,
  EDIT_LIBRARY_FILE,
  REMOVE_LIBRARY_FILE,
  SET_LIBRARY_PATH_EXISTS,
  SET_LIBRARY_PATH,
} from "@/store/actions/index";

type initialStateProps = {
  libraryFiles: LibraryItemInterface[];
  currentPath: string;
  currentPathExists: boolean;
};

const initialState: initialStateProps = {
  libraryFiles: [],
  currentPath: "/",
  currentPathExists: true,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_LIBRARY_FILES:
      return { ...state, libraryFiles: action.libraryFiles };
    case ADD_LIBRARY_FILE:
      return { ...state, libraryFiles: state.libraryFiles.concat(action.libraryFile) };
    case EDIT_LIBRARY_FILE:
      // eslint-disable-next-line no-case-declarations
      const updatedLibrary: LibraryItemInterface[] = action.libraryFiles;
      updatedLibrary.map((item: LibraryItemInterface) => {
        if (item.id === action.libraryFile.id) {
          return action.libraryFile;
        }

        return item;
      });
      return { ...state, libraryFiles: updatedLibrary };
    case REMOVE_LIBRARY_FILE:
      return {
        ...state,
        libraryFiles: state.libraryFiles.filter((item: LibraryItemInterface) => {
          console.log(item.id, action.id);
          return item.id !== action.id;
        }),
      };
    case SET_LIBRARY_PATH_EXISTS:
      return { ...state, currentPathExists: action.pathExists };
    case SET_LIBRARY_PATH:
      return { ...state, currentPath: action.path };
    default:
      return state;
  }
};

export default reducer;
