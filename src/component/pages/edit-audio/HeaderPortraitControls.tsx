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
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { setCursorSelected } from "@/store/actions/audio-editor/index";
import Backdrop from "@/components/ui/Backdrop";
import { PropsAudioEditorSelector } from "@/types/*";
import { removeAllCustomCursorElements } from "./WaveformPlaylist";

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

type Props = {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleTrim: () => void;
  handleSelectAudioRegion: (type: string) => void;
  handleDownload: () => void;
  handleSave: () => void;
};

const ContextMenuOptions = ({
  handleZoomIn,
  handleZoomOut,
  handleSelectAudioRegion,
  handleTrim,
  handleDownload,
  handleSave,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const audioEditorRdx = useSelector(
    (state: { audioEditor: PropsAudioEditorSelector }) => state.audioEditor,
  );
  const [activeSelect, setActiveSelect] = useState(audioEditorRdx.isCursorSelected);
  const [activeShift, setActiveShift] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const dispatch = useDispatch();

  const { t } = useTranslation("editAudio");
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

  const handleActiveSelected = () => {
    const actSel = !activeSelect;
    setActiveSelect(actSel);
    setActiveShift(false);
    if (!isMobile) {
      handleSelectAudioRegion(actSel ? "select" : "cursor");
      dispatch(setCursorSelected(false));
    } else {
      handleSelectAudioRegion("cursor");
      dispatch(setCursorSelected(actSel));
      if (!actSel) {
        removeAllCustomCursorElements();
      }
    }
    handleCloseContextMenu();
  };

  const handleActiveShift = () => {
    const actShi = !activeShift;
    setActiveShift(actShi);
    setActiveSelect(false);
    dispatch(setCursorSelected(false));
    handleSelectAudioRegion(!actShi ? "cursor" : "shift");
    handleCloseContextMenu();
  };

  const handleSaveIntern = () => {
    setLoadingSave(!loadingSave);
    handleSave();
    handleCloseContextMenu();
  };

  const handleDownloadIntern = () => {
    handleDownload();
    handleCloseContextMenu();
  };

  const handleTrimIntern = () => {
    handleTrim();
    handleCloseContextMenu();
  };

  const fontSizeIcon = { fontSize: 15 };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Backdrop open={loadingSave} />
      <IconButton
        key={uuid()}
        icon="audio_settings"
        style={{ padding: 0, margin: 0, minWidth: 30 }}
        iconColor="#fff"
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
        <MenuItem
          key="trim-audio-button"
          data-testid="trim-audio-button"
          onClick={handleTrimIntern}
        >
          <ContextMenuItem
            icon="trim"
            iconColor={theme.palette.variation6.main}
            title={t("contextOptions.trimAudioRegionTitle")}
            style={fontSizeIcon}
          />
        </MenuItem>
        <MenuItem
          key="shift-audio-button"
          data-testid="shift-audio-button"
          onClick={handleActiveShift}
        >
          <ContextMenuItem
            icon="audio_shift"
            iconColor={activeShift ? theme.palette.variation7.main : theme.palette.variation6.main}
            title={t("contextOptions.shiftAudioTitle")}
            style={fontSizeIcon}
          />
        </MenuItem>
        <MenuItem
          key="select-audio-button"
          data-testid="select-audio-button"
          onClick={handleActiveSelected}
        >
          <ContextMenuItem
            icon="cursor_select"
            iconColor={activeSelect ? theme.palette.variation2.dark : theme.palette.variation6.main}
            title={t("contextOptions.selectAudioRegionTitle")}
            style={fontSizeIcon}
          />
        </MenuItem>
        <MenuItem
          key="save-audio-button"
          data-testid="save-audio-button"
          onClick={handleSaveIntern}
        >
          <ContextMenuItem
            icon="save"
            iconColor={theme.palette.variation6.main}
            title={t("contextOptions.saveTitle")}
            style={fontSizeIcon}
            loading={loadingSave}
          />
        </MenuItem>
        <MenuItem
          key="download-audio-button"
          data-testid="download-audio-button"
          onClick={handleDownloadIntern}
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