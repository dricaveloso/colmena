import React, { useState } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Avatar from "@material-ui/core/Avatar";
import { useRouter } from "next/router";
import Drawer from "./Drawer";
import Link from "next/link";
import { useTranslation } from "next-i18next";

function AppBarSys({
  title,
  back,
  headerPosition = "fixed",
  drawer = true,
  ...props
}) {
  const { t } = useTranslation("drawer");
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            {drawer && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setOpenDrawer(!openDrawer)}
              >
                <MenuIcon />
              </IconButton>
            )}
            {back && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => router.back()}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
          </div>
          <Drawer
            open={openDrawer}
            onOpen={() => {}}
            onClose={() => setOpenDrawer(false)}
          />
          <Link href="/home">
            <p style={{ fontSize: 14, fontWeight: "bold" }}>{title}</p>
          </Link>
          <div>
            <Link href="/profile">
              <Avatar alt="Remy Sharp" src="/avatar/3.jpg" />
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}

export default AppBarSys;
