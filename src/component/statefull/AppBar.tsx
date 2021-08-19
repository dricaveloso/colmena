import React, { useState } from "react";
import { IconButton, AppBar, Toolbar } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Link from "next/link";
import { PositionProps, PropsUserSelector } from "@/types/index";
import { PositionEnum, TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import UserAvatar from "@/components/ui/Avatar";
import { useSelector } from "react-redux";
import Drawer from "./Drawer";

type Props = {
  title: string;
  headerPosition?: PositionProps | undefined;
  drawer?: boolean;
};

function AppBarSys({ title, headerPosition = PositionEnum.FIXED, drawer = true }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
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
              <div>
                <UserAvatar size={5} name={userRdx?.user?.name} image={userRdx?.user?.photo} />
              </div>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </header>
  );
}

export default AppBarSys;
