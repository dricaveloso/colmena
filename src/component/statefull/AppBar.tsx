import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { PositionProps, PropsUserSelector, PropsConfigSelector } from "@/types/index";
import { PositionEnum, TextVariantEnum, TextAlignEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import UserAvatar from "@/components/ui/Avatar";
import { useSelector } from "react-redux";
import Drawer from "./Drawer";
import { useRouter } from "next/router";

type Props = {
  title: string;
  headerPosition?: PositionProps | undefined;
  drawer?: boolean;
  back?: boolean;
};

function AppBarSys({
  title,
  headerPosition = PositionEnum.FIXED,
  drawer = true,
  back = false,
}: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const configRdx = useSelector((state: { config: PropsConfigSelector }) => state.config);

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleBack = () => {
    if (router.pathname === "/profile") router.push(configRdx.currentPage);
    else router.back();
  };

  const handleProfilePage = () => {
    router.push("/profile");
  };

  return (
    <header>
      <AppBar position={headerPosition}>
        <Drawer
          open={openDrawer}
          onOpen={() => setOpenDrawer(true)}
          onClose={() => setOpenDrawer(false)}
        />
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
              <IconButton edge="start" color="inherit" aria-label="back" onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            )}
          </div>
          <Text
            variant={TextVariantEnum.H3}
            align={TextAlignEnum.CENTER}
            style={{
              fontSize: 18,
              color: "#fff",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {title}
          </Text>
          <div onClick={handleProfilePage} style={{ cursor: "pointer" }}>
            <UserAvatar size={5} name={userRdx?.user?.name} image={userRdx?.user?.avatar} />
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </header>
  );
}

export default AppBarSys;
