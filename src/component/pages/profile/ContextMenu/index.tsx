import React, { useState, useContext } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import IconButton from "@/components/ui/IconButton";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
// import { confirmAlert } from "react-confirm-alert";
// import ActionConfirm from "@/components/ui/ActionConfirm";
import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
// import { PropsUserSelector } from "@/types/index";
import NotificationContext from "@/store/context/notification-context";
import { NotificationStatusEnum } from "@/enums/*";
// import { signOut } from "next-auth/client";
// import BackdropModal from "@/components/ui/Backdrop";

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

const ContextMenuOptions = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  // const [openConfirmRemove, setOpenConfirmRemove] = useState(false);
  // const [openConfirmSuspend, setOpenConfirmSuspend] = useState(false);
  // const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  // const [showBackdrop, setShowBackdrop] = useState(false);
  const notificationCtx = useContext(NotificationContext);
  const { t } = useTranslation("profile");
  const { t: c } = useTranslation("common");
  const router = useRouter();
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

  // const removeAccountConfirmation = () => {
  //   handleCloseContextMenu();
  //   setOpenConfirmRemove(true);
  // };

  // const suspendAccountConfirmation = () => {
  //   handleCloseContextMenu();
  //   setOpenConfirmSuspend(true);
  // };

  // const removeAccount = async () => {
  //   try {
  //     setShowBackdrop(true);
  //     setOpenConfirmRemove(false);
  //     const response = await fetch("/api/delete-user", {
  //       method: "DELETE",
  //       body: JSON.stringify({ userId: userRdx.user.id }),
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     if (data.success) {
  //       notificationCtx.showNotification({
  //         message: t("messageSuccessAccountDeleted"),
  //         status: NotificationStatusEnum.SUCCESS,
  //       });
  //       await signOut({ redirect: false });
  //       router.push("/login");
  //     } else
  //       notificationCtx.showNotification({
  //         message: c("genericErrorMessage"),
  //         status: NotificationStatusEnum.ERROR,
  //       });
  //   } catch (e) {
  //     notificationCtx.showNotification({
  //       message: c("genericErrorMessage"),
  //       status: NotificationStatusEnum.ERROR,
  //     });
  //   } finally {
  //     setShowBackdrop(false);
  //   }
  // };

  // const disableAccount = async () => {
  //   try {
  //     setShowBackdrop(true);
  //     setOpenConfirmSuspend(false);
  //     const response = await fetch("/api/disable-user", {
  //       method: "PUT",
  //       body: JSON.stringify({ userId: userRdx.user.id }),
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     if (data.success) {
  //       notificationCtx.showNotification({
  //         message: t("messageSuccessAccountDeactivated"),
  //         status: NotificationStatusEnum.SUCCESS,
  //       });
  //       await signOut({ redirect: false });
  //       router.push("/login");
  //     } else
  //       notificationCtx.showNotification({
  //         message: c("genericErrorMessage"),
  //         status: NotificationStatusEnum.ERROR,
  //       });
  //   } catch (e) {
  //     notificationCtx.showNotification({
  //       message: c("genericErrorMessage"),
  //       status: NotificationStatusEnum.ERROR,
  //     });
  //   } finally {
  //     setShowBackdrop(false);
  //   }
  // };

  const featureUnavailable = () => {
    notificationCtx.showNotification({
      message: c("featureUnavailable"),
      status: NotificationStatusEnum.WARNING,
    });
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      {/* {showBackdrop && <BackdropModal open={showBackdrop} />}
      {openConfirmRemove && (
        <ActionConfirm
          message={t("confirmationRemoveAccountMessage")}
          onClose={() => setOpenConfirmRemove(false)}
          onOk={removeAccount}
        />
      )}
      {openConfirmSuspend && (
        <ActionConfirm
          message={t("confirmationSuspendAccountMessage")}
          onClose={() => setOpenConfirmSuspend(false)}
          onOk={disableAccount}
        />
      )} */}
      <IconButton
        key={uuid()}
        icon="more_vertical"
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
        <MenuItem key="settings" onClick={() => router.push("/settings")}>
          {t("contextMenuOptions.settings")}
        </MenuItem>
        <MenuItem key="suspend" onClick={featureUnavailable}>
          {t("contextMenuOptions.deactivate")}
        </MenuItem>
        <MenuItem key="remove" onClick={featureUnavailable} style={{ color: "tomato" }}>
          {t("contextMenuOptions.remove")}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ContextMenuOptions;
