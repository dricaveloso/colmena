import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import SvgIcon from "@/components/ui/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
// import { PositionProps, PropsUserSelector, PropsConfigSelector } from "@/types/index";
import { PositionProps, PropsConfigSelector } from "@/types/index";
import { PositionEnum, TextVariantEnum, TextAlignEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
// import UserAvatar from "@/components/ui/Avatar";
import { useSelector } from "react-redux";
import Drawer from "./GeneralMenuDrawer";
import { useRouter } from "next/router";
import theme from "@/styles/theme";

type Props = {
  title: string;
  headerPosition?: PositionProps | undefined;
  drawer?: boolean;
  back?: boolean;
  templateHeader?: "variation1" | "variation2";
};

function AppBarSys({
  title,
  headerPosition = PositionEnum.FIXED,
  drawer = true,
  back = false,
  templateHeader = "variation1",
}: Props) {
  // const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const configRdx = useSelector((state: { config: PropsConfigSelector }) => state.config);

  const [openDrawer, setOpenDrawer] = useState(false);

  const tplHeader = new Map();
  tplHeader.set("variation1", {
    backgroundAppBar: "#fff",
    textColor: "#292929",
  });
  tplHeader.set("variation2", {
    backgroundAppBar: theme.palette.primary.main,
    textColor: "#fff",
  });

  const handleBack = () => {
    if (router.pathname === "/profile") router.push(configRdx.currentPage);
    else router.back();
  };

  // const handleProfilePage = () => {
  //   router.push("/profile");
  // };

  return (
    <header>
      <AppBar position={headerPosition} elevation={0} style={{ height: 70 }}>
        <Drawer
          open={openDrawer}
          // onOpen={() => setOpenDrawer(true)}
          onClose={() => setOpenDrawer(false)}
        />
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: 70,
            backgroundColor: tplHeader.get(templateHeader).backgroundAppBar,
          }}
        >
          <Box display="flex" flexDirection="row" alignItems="center">
            {back && (
              <IconButton edge="start" color="inherit" aria-label="back" onClick={handleBack}>
                <SvgIcon icon="back" htmlColor={tplHeader.get(templateHeader).textColor} />
              </IconButton>
            )}
            <Text
              variant={TextVariantEnum.H3}
              align={TextAlignEnum.CENTER}
              style={{
                fontSize: 20,
                color: tplHeader.get(templateHeader).textColor,
                fontWeight: 900,
                fontFamily: "Nunito sans, sans-serif",
              }}
            >
              {title}
            </Text>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            {drawer && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setOpenDrawer(!openDrawer)}
              >
                <SvgIcon
                  icon="burger_menu"
                  htmlColor={tplHeader.get(templateHeader).textColor}
                  fontSize="medium"
                />
              </IconButton>
            )}
          </Box>

          {/* <div onClick={handleProfilePage} style={{ cursor: "pointer" }}>
            <UserAvatar size={5} name={userRdx?.user?.name} image={userRdx?.user?.avatar} />
          </div> */}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </header>
  );
}

export default AppBarSys;
