import React, { useState } from "react";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import { basename } from "path";
import Progress from "./Progress";
import Image from "next/image";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ContextMenuItem from "@/components/ui/ContextMenuItem";
import { useDispatch } from "react-redux";
import { updateStatus, removeFile, setOpenTransferModal } from "@/store/actions/transfers";
import {
  getByTempfilename as getTransferByTempfilename,
  update as updateTransfer,
  removeByTempfilename,
} from "@/store/idb/models/transfers";
import { StatusTransferItemProps } from "@/types/index";
import SvgIcon from "@/components/ui/SvgIcon";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import theme from "@/styles/theme";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    background: "#fff",
    padding: 8,
    borderRadius: 5,
    border: "1px solid #eee",
    cursor: "pointer",
  },
  description: {
    flexDirection: "column",
    flexGrow: 1,
    alignSelf: "stretch",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginLeft: 7,
  },
  options: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  avatar: {
    minHeight: 50,
    display: "flex",
    alignItems: "center",
  },
  iconColorDanger: {
    color: "#ff6347",
  },
}));

type Props = {
  tempFilename: string;
  filename: string;
  status: StatusTransferItemProps;
};

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

export default function Transfer({ tempFilename, filename, status }: Props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const { t: c } = useTranslation("common");
  const [anchorEl, setAnchorEl] = useState(null);
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

  const cancelUpload = async () => {
    const transfer = await getTransferByTempfilename(tempFilename);
    await updateTransfer(transfer.id, {
      currentChunk: 0,
      status: "canceled",
      updatedAt: Date.now(),
    });
    dispatch(updateStatus(tempFilename, "canceled"));
  };

  const removeUpload = async () => {
    await removeByTempfilename(tempFilename);
    dispatch(removeFile(tempFilename));
  };

  const openFile = () => {
    dispatch(setOpenTransferModal(false));
    router.push(`/file/${btoa(filename)}`);
  };

  const showFilenamePath = () => {
    const arr = filename.split("/");
    arr.pop();
    return arr.join("/");
  };

  const showFilenameName = () => {
    const arr = filename.split("/");
    return arr[arr.length - 1];
  };

  return (
    <>
      <Box className={classes.card} onClick={handleOpenContextMenu}>
        <Progress tempFilename={tempFilename} status={status} />
        <ListItemText
          data-testid={`library-item-${basename}`}
          className={classes.description}
          primary={showFilenameName()}
          primaryTypographyProps={{ style: { fontWeight: "bold" } }}
          secondary={`/${showFilenamePath()}`}
        />
        {status === "in progress" && <Image src="/images/upload.gif" width={30} height={30} />}
        {status === "complete" && (
          <SvgIcon icon="sync_success" htmlColor="green" fontSize="large" />
        )}
        {status === "canceled" && (
          <SvgIcon icon="sync_canceled" htmlColor={theme.palette.danger.light} fontSize="large" />
        )}
      </Box>
      <Menu
        key={`simple-menu-${tempFilename}`}
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
        {status === "complete" && (
          <MenuItem key="open" data-testid="open-details-file" onClick={openFile}>
            <ContextMenuItem icon="show" title={c("transfer.openDetailsFile")} />
          </MenuItem>
        )}
        {(status === "complete" || status === "canceled") && (
          <MenuItem key="clean" data-testid="clean-transfer-item" onClick={removeUpload}>
            <ContextMenuItem icon="clean" title={c("transfer.cleanTransfer")} />
          </MenuItem>
        )}
        {status === "in progress" && (
          <MenuItem
            key="disabled"
            data-testid="cancel-transfer-item"
            onClick={cancelUpload}
            className={classes.iconColorDanger}
          >
            <ContextMenuItem
              iconColor="#ff6347"
              icon="cancel"
              title={c("transfer.cancelTransfer")}
            />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
