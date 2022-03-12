/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useCallback } from "react";
import Backdrop from "@/components/ui/Backdrop";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import Avatar from "./Avatar";
import { useTranslation } from "next-i18next";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ContextMenuItem from "@/components/ui/ContextMenuItem";
import { v4 as uuid } from "uuid";
import { toast } from "@/utils/notifications";
import Slider from "@material-ui/core/Slider";
import Cropper from "react-easy-crop";
import Modal from "@/components/ui/Modal";
import { ButtonColorEnum, ButtonVariantEnum, ConfigFilesNCEnum } from "@/enums/*";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import { isPNGImage, isJPGImage } from "@/utils/utils";
import getCroppedImg from "@/utils/cropImage";
import { blobToArrayBuffer } from "blob-util";
import { putFile, deleteFile } from "@/services/webdav/files";
import { getUserGroup } from "@/utils/permissions";
import { makeStyles } from "@material-ui/core/styles";
import {
  create as createMedia,
  findByName as findByMediaName,
  update as updateMedia,
  remove as removeMedia,
} from "@/store/idb/models/media";

type Props = {
  size: number;
  showEditImage?: boolean;
};

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

type CroppedAreaProps = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const useStyles = makeStyles((theme) => ({
  iconRemove: {
    color: theme.palette.danger.light,
  },
}));

function AvatarChangePicture({ size, showEditImage = true }: Props) {
  const classes = useStyles();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const inputFileRef = useRef(null);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [file, setFile] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [reloadAvatar, setReloadAvatar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { t: c } = useTranslation("common");
  const { t } = useTranslation("mediaProfile");
  const [position, setPosition] = useState<PositionProps>({
    mouseX: null,
    mouseY: null,
  });
  const [fileTarget, setFileTarget] = useState<Blob | null>(null);
  const [fileNameTarget, setFileNameTarget] = useState("");
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaProps>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const mediaName = getUserGroup();

  const handleOpenContextMenu = (event: any) => {
    if (!showEditImage) return;
    setAnchorEl(event.currentTarget);
    setPosition({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleReloadAvatar = () => {
    setReloadAvatar(true);
    setTimeout(() => {
      setReloadAvatar(false);
    }, 2000);
  };

  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setFileTarget(null);
    setFile("");
    setShowModal(false);
  };

  const featureUnavailable = () => {
    toast(c("featureUnavailable"), "warning");
  };

  const removeMediaAvatar = async () => {
    try {
      setLoadingRemove(true);
      handleCloseContextMenu();
      await deleteFile(userRdx.user.id, `${mediaName}/${ConfigFilesNCEnum.MEDIA_PROFILE_AVATAR}`);
      const mediaIdb = await findByMediaName(mediaName);
      if (mediaIdb) {
        await removeMedia(mediaIdb.id);
      }
      handleReloadAvatar();
      toast(t("mediaProfileAvatarRemoved"), "success");
    } catch (e) {
      console.log(e);
      toast(c("genericErrorMessage"), "warning");
    } finally {
      setLoadingRemove(false);
    }
  };

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
      setFileTarget(e.target.files[0]);
      setFileNameTarget(e.target.files[0].name);
      setShowModal(true);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      setShowBackdrop(true);
      const croppedImage = await getCroppedImg(file, croppedAreaPixels, 0);
      const imageArrayBuffer = await blobToArrayBuffer(croppedImage);

      const result = await putFile(
        userRdx.user.id,
        `${mediaName}/${ConfigFilesNCEnum.MEDIA_PROFILE_AVATAR}`,
        imageArrayBuffer,
        {
          username: userRdx.user.id,
          password: userRdx.user.password,
        },
      );
      if (!result) throw new Error("error");

      const mediaIdb = await findByMediaName(mediaName);
      if (!mediaIdb) {
        await createMedia({ name: mediaName, image: imageArrayBuffer });
      } else {
        await updateMedia(mediaIdb.id, { image: imageArrayBuffer });
      }

      handleReloadAvatar();
      toast(t("mediaProfileAvatarSaved"), "success");
    } catch (e) {
      console.log(e);
      toast(c("genericErrorMessage"), "warning");
    } finally {
      setShowBackdrop(false);
      setShowModal(false);
    }
  }, [croppedAreaPixels, file]);

  const onBtnClick = () => {
    handleCloseContextMenu();
    if (!inputFileRef || !inputFileRef.current) return;

    const clk: { click: () => void } = inputFileRef?.current;

    clk.click();
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

  return (
    <>
      <Backdrop open={loadingRemove} />
      <Backdrop open={showBackdrop} />
      <input type="file" ref={inputFileRef} onChange={onSelectFile} style={{ display: "none" }} />
      <Box
        onClick={handleOpenContextMenu}
        data-testid="media-avatar-open-context"
        style={{ cursor: "pointer" }}
      >
        {reloadAvatar ? (
          <Loading />
        ) : (
          <Avatar size={size} mediaName={getUserGroup()} showEditImage={showEditImage} />
        )}
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Menu
          key={uuid()}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          anchorReference="anchorPosition"
          anchorPosition={
            position.mouseY !== null && position.mouseX !== null
              ? { top: position.mouseY, left: position.mouseX }
              : undefined
          }
          onClose={handleCloseContextMenu}
        >
          <MenuItem key="upload" data-testid="upload-media-avatar-menu-option" onClick={onBtnClick}>
            <ContextMenuItem icon="camera" title={c("contextMenuUserAvatar.upload")} />
          </MenuItem>
          <MenuItem
            key="remove"
            data-testid="remove-media-avatar-menu-option"
            onClick={removeMediaAvatar}
            className={classes.iconRemove}
          >
            <ContextMenuItem icon="trash" danger title={c("contextMenuUserAvatar.remove")} />
          </MenuItem>
        </Menu>
      </Box>

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
    </>
  );
}

export default AvatarChangePicture;
