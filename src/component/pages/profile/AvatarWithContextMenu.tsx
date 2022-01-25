/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from "react";
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

type Props = {
  size: number;
  showEditImage?: boolean;
};

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

function AvatarChangePicture({ size, showEditImage = true }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const inputFileRef = useRef(null);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const { t: c } = useTranslation("common");
  const [position, setPosition] = useState<PositionProps>({
    mouseX: null,
    mouseY: null,
  });

  const handleOpenContextMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
    setPosition({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  const featureUnavailable = () => {
    toast(c("featureUnavailable"), "warning");
  };

  const onFileChange = async (e: any) => {
    setShowBackdrop(true);
    const body = new FormData();
    const ext = e.target.files[0].name.split(".");
    body.append("files", e.target.files[0]);
    body.append("user", userRdx.user.id);
    body.append("password", userRdx.user.password);
    body.append("extension", ext[ext.length - 1]);
    try {
      const response = await fetch(`/api/create-avatar/${userRdx.user.id}`, {
        method: "POST",
        body,
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    } finally {
      setShowBackdrop(false);
    }
  };
  const onBtnClick = () => {
    handleCloseContextMenu();
    // if (!inputFileRef || !inputFileRef.current) return;
    // inputFileRef?.current?.click();
  };
  return (
    <>
      <Backdrop open={showBackdrop} />
      <input type="file" ref={inputFileRef} onChange={onFileChange} style={{ display: "none" }} />
      <Box onClick={handleOpenContextMenu} style={{ cursor: "pointer" }}>
        <Avatar size={size} showEditImage={showEditImage} />
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
          <MenuItem key="settings" onClick={onBtnClick}>
            <ContextMenuItem icon="camera" title={c("contextMenuUserAvatar.upload")} />
          </MenuItem>
          <MenuItem key="remove" onClick={featureUnavailable} style={{ color: "#ff6347" }}>
            <ContextMenuItem
              icon="trash"
              iconColor="#ff6347"
              title={c("contextMenuUserAvatar.remove")}
            />
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}

export default AvatarChangePicture;
