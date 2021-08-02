import React, { useState } from "react";
import { IconButton, AppBar, Avatar, Toolbar } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Link from "next/link";
import { PositionProps, PropsUserSelector } from "@/types/index";
import { PositionEnum, TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import { useSelector } from "react-redux";
import { getFirstLettersOfTwoFirstNames } from "@/utils/utils";
import Drawer from "./Drawer";

type Props = {
  title: string;
  headerPosition?: PositionProps | undefined;
  drawer?: boolean;
};

function AppBarSys({ title, headerPosition = PositionEnum.FIXED, drawer = true }: Props) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

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
              <Avatar
                alt="user-avatar"
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/${userRdx.user?.photo}`}
              >
                {getFirstLettersOfTwoFirstNames(userRdx.user?.name)}
              </Avatar>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </header>
  );
}

export default AppBarSys;
