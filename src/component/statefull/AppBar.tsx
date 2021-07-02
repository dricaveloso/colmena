import React, { useState } from "react";
import { IconButton, AppBar, Avatar, Toolbar } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useRouter } from "next/router";
import Drawer from "./Drawer";
import Link from "next/link";
import { PositionProps } from "types";
import { PositionEnum } from "enums";

type Props = {
  title: string;
  back?: boolean;
  headerPosition?: PositionProps | undefined;
  drawer?: boolean;
};

function AppBarSys({
  title,
  back,
  headerPosition = PositionEnum.FIXED,
  drawer = true,
}: Props) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();

  return (
    <header>
      <AppBar position={headerPosition}>
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
    </header>
  );
}

export default AppBarSys;
