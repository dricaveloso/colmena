import React, { useState } from "react";
import { IconButton, AppBar, Avatar, Toolbar } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Link from "next/link";
import { PositionProps } from "@/types/index";
import { PositionEnum, TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import Drawer from "./Drawer";

type Props = {
  title: string;
  headerPosition?: PositionProps | undefined;
  drawer?: boolean;
};

function AppBarSys({ title, headerPosition = PositionEnum.FIXED, drawer = true }: Props) {
  const [openDrawer, setOpenDrawer] = useState(false);

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
          </div>
          <Drawer
            open={openDrawer}
            onOpen={() => setOpenDrawer(true)}
            onClose={() => setOpenDrawer(false)}
          />
          <Text variant={TextVariantEnum.H3} style={{ fontSize: 18, fontWeight: "bold" }}>
            {title}
          </Text>
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
