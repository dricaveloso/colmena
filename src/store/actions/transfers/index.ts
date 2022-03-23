import {
  SET_OPEN_TRANSFER_MODAL,
  ADD_FILE_TO_TRANSFER,
  REMOVE_FILE_FROM_TRANSFER,
  UPDATE_STATUS_FILE_TRANSFER,
  REMOVE_ALL_COMPLETED_FILES_FROM_TRANSFER,
} from "@/store/actions/index";
import { TransferItemInterface } from "@/interfaces/index";
import { StatusTransferItemProps } from "@/types/index";

export const setOpenTransferModal = (openTransferModal: boolean) => ({
  type: SET_OPEN_TRANSFER_MODAL,
  openTransferModal,
});

export const addFile = (file: TransferItemInterface) => ({
  type: ADD_FILE_TO_TRANSFER,
  file,
});

export const updateStatus = (tempFilename: string, status: StatusTransferItemProps) => ({
  type: UPDATE_STATUS_FILE_TRANSFER,
  payload: {
    tempFilename,
    status,
  },
});

export const removeFile = (tempFilename: string) => ({
  type: REMOVE_FILE_FROM_TRANSFER,
  tempFilename,
});

export const removeAllCompletedFiles = () => ({
  type: REMOVE_ALL_COMPLETED_FILES_FROM_TRANSFER,
});
