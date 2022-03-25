import React, { useRef, useState, useCallback, useEffect } from "react";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import { useTranslation } from "next-i18next";
import { toast } from "@/utils/notifications";
import Slider from "@material-ui/core/Slider";
import Cropper from "react-easy-crop";
import Modal from "@/components/ui/Modal";
import { ButtonColorEnum, ButtonVariantEnum, ConfigFilesNCEnum } from "@/enums/*";
import Button from "@/components/ui/Button";
import { isPNGImage, isJPGImage } from "@/utils/utils";
import getCroppedImg from "@/utils/cropImage";
import { blobToArrayBuffer } from "blob-util";
import { putFile } from "@/services/webdav/files";
import SimpleBackdrop from "@/components/ui/Backdrop";
import { Fade, Dialog } from "@material-ui/core";

type Props = {
  honeycombPath: string;
  reloadAvatar?: (file: ArrayBuffer) => void;
  setOpenUpload: (opt: boolean) => void;
  openUpload: boolean;
};

type CroppedAreaProps = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export default function ModalChangeAvatar({
  honeycombPath,
  reloadAvatar,
  openUpload,
  setOpenUpload,
}: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [file, setFile] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const inputFileRef = useRef(null);
  const formRef = useRef(null);
  const { t } = useTranslation("honeycomb");
  const { t: c } = useTranslation("common");
  const [showModal, setShowModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaProps>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const onSelectFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const { type, size } = e.target.files[0];

      if (!isPNGImage(type) && !isJPGImage(type)) {
        toast(c("uploadRuleFileType"), "warning");
        return;
      }

      // 20MB limite do NC
      if (size > 20971520) {
        toast(c("uploadRuleFileSize"), "warning");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => setFile(String(reader.result)));
      setShowModal(true);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCloseModal = () => {
    setFile("");
    setShowModal(false);
  };

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onCropComplete = (_: any, croppedAreaPixels: CroppedAreaProps) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleReloadAvatar = (file: ArrayBuffer) => {
    if (typeof reloadAvatar === "function") {
      reloadAvatar(file);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      setIsLoading(true);
      const croppedImage = await getCroppedImg(file, croppedAreaPixels, 0);
      const imageArrayBuffer = await blobToArrayBuffer(croppedImage);
      const filePath = `${honeycombPath}/${ConfigFilesNCEnum.HONEYCOMB_AVATAR}`;

      const result = await putFile(userRdx.user.id, filePath, imageArrayBuffer);

      if (!result) throw new Error("error");

      handleReloadAvatar(imageArrayBuffer);
      toast(t("messages.honeycombAvatarSaved"), "success");
    } catch (e) {
      console.log(e);
      toast(c("genericErrorMessage"), "warning");
    } finally {
      setShowModal(false);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedAreaPixels, file]);

  useEffect(() => {
    if (openUpload) {
      if (!inputFileRef || !inputFileRef.current) return;
      if (!formRef || !formRef.current) return;

      const input: HTMLInputElement = inputFileRef.current;
      const form: HTMLFormElement = formRef.current;

      form.reset();
      input.click();

      setOpenUpload(false);
    }
  }, [openUpload, setOpenUpload]);

  return (
    <>
      <form ref={formRef}>
        <input
          type="file"
          ref={inputFileRef}
          data-testid="upload-avatar"
          onChange={onSelectFile}
          style={{ display: "none" }}
        />
      </form>
      <Modal
        open={showModal}
        handleClose={handleCloseModal}
        actions={
          <Box display="flex" flex="1" flexDirection="row" justifyContent="space-between">
            <Button
              handleClick={handleCloseModal}
              style={{ margin: 8 }}
              variant={ButtonVariantEnum.OUTLINED}
              color={ButtonColorEnum.SECONDARY}
              title={c("form.cancelButton")}
              data-testid="close-modal-crop-media-avatar"
            />
            <Button
              handleClick={showCroppedImage}
              style={{ margin: 8 }}
              variant={ButtonVariantEnum.CONTAINED}
              title={c("form.submitSaveTitle")}
              data-testid="submit-modal-crop-media-avatar"
              isLoading={isLoading}
            />
          </Box>
        }
      >
        <Box>
          <Box width="100%" height={280}>
            <Cropper
              image={file}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              cropShape="round"
              showGrid
              style={{
                containerStyle: { width: "100%", height: 300 },
                cropAreaStyle: { width: 250, height: 250 },
                // mediaStyle: { width: "100%", height: "100%", margin: "0 auto" },
              }}
              cropSize={{ width: 250, height: 250 }}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={onZoomChange}
              objectFit="vertical-cover"
            />
          </Box>
          <Box height={30}>
            <Slider
              data-testid="slider-modal-crop-media-avatar"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e, zoom: number) => onZoomChange(zoom)}
              style={{ paddingTop: 22, paddingBottom: 22, paddingLeft: 0, paddingRight: 0 }}
            />
          </Box>
        </Box>
      </Modal>
      <Dialog open={isLoading} fullWidth>
        <Fade in={isLoading}>
          <SimpleBackdrop open={isLoading} />
        </Fade>
      </Dialog>
    </>
  );
}
