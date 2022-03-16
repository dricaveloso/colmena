/* eslint-disable react-hooks/exhaustive-deps */
import { TransferItemInterface } from "@/interfaces/index";
import { UploadItemMemoized } from "./item";

type Props = {
  files: TransferItemInterface[];
};

export default function Upload({ files }: Props) {
  return (
    <>
      {files
        .filter((item) => item)
        .map((item: TransferItemInterface) => (
          <span key={item.tempFilename}>
            <UploadItemMemoized file={item} />
          </span>
        ))}
    </>
  );
}
