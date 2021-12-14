import {
  SET_LIBRARY_FILES,
  ADD_LIBRARY_FILE,
  EDIT_LIBRARY_FILE,
  REMOVE_LIBRARY_FILE,
  SET_LIBRARY_PATH_EXISTS,
  SET_LIBRARY_PATH,
  CURRENT_AUDIO_PLAYING,
} from "@/store/actions/index";
import { LibraryItemInterface } from "@/interfaces/index";

export const setLibraryFiles = (libraryFiles: Array<LibraryItemInterface>) => ({
  type: SET_LIBRARY_FILES,
  libraryFiles,
});

export const addLibraryFile = (libraryFile: LibraryItemInterface) => ({
  type: ADD_LIBRARY_FILE,
  libraryFile,
});

export const editLibraryFile = (libraryFile: any) => ({
  type: EDIT_LIBRARY_FILE,
  libraryFile,
});

export const removeLibraryFile = (id: string | number | null) => ({
  type: REMOVE_LIBRARY_FILE,
  id,
});

export const setLibraryPathExists = (pathExists: boolean) => ({
  type: SET_LIBRARY_PATH_EXISTS,
  pathExists,
});

export const setLibraryPath = (path: string) => ({
  type: SET_LIBRARY_PATH,
  path,
});

export const setCurrentAudioPlaying = (filename: string) => ({
  type: CURRENT_AUDIO_PLAYING,
  filename,
});
