import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import IconButton from "@/components/ui/IconButton";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { toast } from "@/utils/notifications";
import ContextMenuItem from "@/components/ui/ContextMenuItem";
import EditMedia from "../EditMedia";
import { isSubadminProfile } from "@/utils/permissions";

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

const ContextMenuOptions = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditMedia, setOpenEditMedia] = useState(false);
  const { t } = useTranslation("mediaProfile");
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

  const handleOpenEditForm = () => {
    if (!isSubadminProfile()) {
      toast(c("noPrivilegesAccessTitle"), "warning");
      return;
    }

    setOpenEditMedia(true);
    handleCloseContextMenu();
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <IconButton
        key={uuid()}
        icon="more_vertical"
        data-testid="open-context-profile-menu"
        iconColor="#fff"
        style={{ padding: 0, margin: 0, minWidth: 30 }}
        fontSizeIcon="small"
        handleClick={handleOpenContextMenu}
      />
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
        {/* <MenuItem
          key="settings"
          data-testid="media-profile-settings-menu-option"
          onClick={featureUnavailable}
        >
          <ContextMenuItem icon="settings" title={t("contextMenuOptions.settings")} />
        </MenuItem> */}
        <MenuItem
          key="edit"
          data-testid="media-profile-edit-menu-option"
          onClick={handleOpenEditForm}
        >
          <ContextMenuItem icon="edit" title={t("contextMenuOptions.edit")} />
        </MenuItem>
        <MenuItem
          key="disabled"
          data-testid="media-profile-disabled-menu-option"
          onClick={featureUnavailable}
          style={{ color: "#ff6347" }}
        >
          <ContextMenuItem
            iconColor="#ff6347"
            icon="disabled"
            title={t("contextMenuOptions.deactivate")}
          />
        </MenuItem>
      </Menu>
      <EditMedia
        title={t("titleEditMediaModal")}
        open={openEditMedia}
        handleClose={() => setOpenEditMedia(false)}
      />
    </Box>
  );
};

export default ContextMenuOptions;
