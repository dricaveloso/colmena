import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import IconButton from "@/components/ui/IconButton";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { toast } from "@/utils/notifications";
import { downloadFile } from "@/utils/utils";

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

type Props = {
  data: any | undefined;
  blob: Blob | undefined;
};

const ContextMenuOptions = ({ blob, data }: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation("file");
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

  return (
    <Box display="flex" justifyContent="flex-end">
      <IconButton
        key={uuid()}
        icon="more_vertical"
        iconColor="#656469"
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
        <MenuItem
          key="download"
          onClick={() => downloadFile(blob, data.title, data.getcontenttype)}
        >
          {t("contextMenuOptions.downloadTitle")}
        </MenuItem>
        <MenuItem key="rename" onClick={() => toast(c("featureUnavailable"), "warning")}>
          {t("contextMenuOptions.renameTitle")}
        </MenuItem>
        <MenuItem key="edit" onClick={() => toast(c("featureUnavailable"), "warning")}>
          {t("contextMenuOptions.editAudio")}
        </MenuItem>
        <MenuItem
          key="remove"
          onClick={() => toast(c("featureUnavailable"), "warning")}
          style={{ color: "tomato" }}
        >
          {t("contextMenuOptions.deleteAudio")}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ContextMenuOptions;
