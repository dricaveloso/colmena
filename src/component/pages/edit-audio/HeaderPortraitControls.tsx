/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import IconButton from "@/components/ui/IconButton";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import ContextMenuItem from "@/components/ui/ContextMenuItem";
import theme from "@/styles/theme";
import { toast } from "@/utils/notifications";

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

type Props = {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleTrim: () => void;
  handleSelectAudioRegion: (type: string) => void;
};

const ContextMenuOptions = ({
  handleZoomIn,
  handleZoomOut,
  handleSelectAudioRegion,
  handleTrim,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSelectedCursorActive, setIsSelectedCursorActive] = useState(false);

  const { t } = useTranslation("editAudio");
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

  const unavailable = () => {
    toast(c("featureUnavailable"), "warning");
  };

  const handleSelectAudioRegionIntern = () => {
    setIsSelectedCursorActive((isSelectedCursorActive) => {
      handleSelectAudioRegion(!isSelectedCursorActive ? "select" : "cursor");
      return !isSelectedCursorActive;
    });
    handleCloseContextMenu();
  };

  const fontSizeIcon = { fontSize: 15 };

  return (
    <Box display="flex" justifyContent="flex-end">
      <IconButton
        key={uuid()}
        icon="audio_settings"
        style={{ padding: 0, margin: 0, minWidth: 30 }}
        iconColor="white"
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
        <MenuItem key="zoom-in-button" data-testid="zoom-in-button" onClick={handleZoomIn}>
          <ContextMenuItem
            icon="zoomin"
            iconColor={theme.palette.variation6.main}
            title={t("contextOptions.zoomInTitle")}
            style={fontSizeIcon}
          />
        </MenuItem>
        <MenuItem key="zoom-out-button" data-testid="zoom-out-button" onClick={handleZoomOut}>
          <ContextMenuItem
            icon="zoomout"
            iconColor={theme.palette.variation6.main}
            title={t("contextOptions.zoomOutTitle")}
            style={fontSizeIcon}
          />
        </MenuItem>
        <MenuItem key="cut-audio-button" data-testid="cut-audio-button" onClick={handleTrim}>
          <ContextMenuItem
            icon="cut"
            iconColor={theme.palette.variation6.main}
            title={t("contextOptions.cutAudioRegionTitle")}
            style={fontSizeIcon}
          />
        </MenuItem>
        <MenuItem
          key="select-audio-button"
          data-testid="select-audio-button"
          onClick={handleSelectAudioRegionIntern}
        >
          <ContextMenuItem
            icon="cursor_select"
            iconColor={theme.palette.variation6.main}
            title={t("contextOptions.selectAudioRegionTitle")}
            style={fontSizeIcon}
          />
        </MenuItem>
        <MenuItem key="save-audio-button" data-testid="save-audio-button" onClick={unavailable}>
          <ContextMenuItem
            icon="save"
            iconColor={theme.palette.variation6.main}
            title={t("contextOptions.saveTitle")}
            style={fontSizeIcon}
          />
        </MenuItem>
        <MenuItem
          key="download-audio-button"
          data-testid="download-audio-button"
          onClick={unavailable}
        >
          <ContextMenuItem
            icon="download"
            iconColor={theme.palette.variation6.main}
            title={t("contextOptions.downloadTitle")}
            style={fontSizeIcon}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ContextMenuOptions;
