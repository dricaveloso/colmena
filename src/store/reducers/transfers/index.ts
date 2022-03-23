import {
  SET_OPEN_TRANSFER_MODAL,
  ADD_FILE_TO_TRANSFER,
  UPDATE_STATUS_FILE_TRANSFER,
  REMOVE_FILE_FROM_TRANSFER,
  REMOVE_ALL_COMPLETED_FILES_FROM_TRANSFER,
} from "@/store/actions/index";
import { TransferItemInterface } from "@/interfaces/index";

type initialStateProps = {
  openTransferModal: boolean;
  files: TransferItemInterface[];
};

const initialState: initialStateProps = {
  openTransferModal: false,
  files: [],
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_OPEN_TRANSFER_MODAL:
      return {
        ...state,
        openTransferModal: action.openTransferModal,
      };
    case ADD_FILE_TO_TRANSFER:
      return { ...state, files: state.files.concat(action.file) };
    case REMOVE_FILE_FROM_TRANSFER:
      return {
        ...state,
        files: state.files.filter(
          (item: TransferItemInterface) => item.tempFilename !== action.tempFilename,
        ),
      };
    case REMOVE_ALL_COMPLETED_FILES_FROM_TRANSFER:
      return {
        ...state,
        // files: state.files.filter((item: TransferItemInterface) => item.status !== "complete"),
        files: [],
      };
    case UPDATE_STATUS_FILE_TRANSFER:
      // eslint-disable-next-line no-case-declarations
      const filesAux = state.files;
      filesAux.map((item: TransferItemInterface) => {
        if (item.tempFilename === action.payload.tempFilename) {
          // eslint-disable-next-line no-param-reassign
          item.status = action.payload.status;
        }

        return item;
      });
      return { ...state, files: filesAux };
    default:
      return state;
  }
};

export default reducer;
