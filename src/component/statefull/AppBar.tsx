import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import SvgIcon from "@/components/ui/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
import { PositionProps, PropsConfigSelector } from "@/types/index";
import { PositionEnum, TextVariantEnum, TextAlignEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import { useSelector } from "react-redux";
import Drawer from "./GeneralMenuDrawer";
import { useRouter } from "next/router";
import theme from "@/styles/theme";

type Props = {
  title: string;
  subtitle?: string | React.ReactNode;
  headerPosition?: PositionProps | undefined;
  drawer?: boolean;
  back?: boolean;
  templateHeader?: "variation1" | "variation2";
  extraElement?: React.ReactNode | undefined;
};

export const tplHeader = new Map();
tplHeader.set("variation1", {
  backgroundAppBar: "#fff",
  textColor: "#292929",
});
tplHeader.set("variation2", {
  backgroundAppBar: theme.palette.primary.main,
  textColor: "#fff",
});

function AppBarSys({
  title,
  subtitle,
  headerPosition = PositionEnum.FIXED,
  drawer = true,
  back = false,
  templateHeader = "variation2",
  extraElement = undefined,
}: Props) {
  // const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const configRdx = useSelector((state: { config: PropsConfigSelector }) => state.config);

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleBack = () => {
    if (router.pathname === "/profile") router.push(configRdx.currentPage);
    else router.back();
  };

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
            <Box display="flex" flexDirection="column" justifyContent="flex-start">
              <Text
                variant={TextVariantEnum.H3}
                align={TextAlignEnum.LEFT}
                style={{
                  fontSize: 20,
                  color: tplHeader.get(templateHeader).textColor,
                  fontWeight: 900,
                  fontFamily: "Nunito sans, sans-serif",
                }}
              >
                {title}
              </Text>
              {subtitle !== "" && (
                <Text
                  variant={TextVariantEnum.H3}
                  align={TextAlignEnum.LEFT}
                  style={{
                    fontSize: 15,
                    color: "#B4AEF5",
                    fontFamily: "Nunito sans, sans-serif",
                    paddingTop: 2,
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            {extraElement && extraElement}
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
        </Toolbar>
      </AppBar>
      {(headerPosition === PositionEnum.FIXED || headerPosition === PositionEnum.ABSOLUTE) && (
        <Toolbar style={{ height: 70 }} />
      )}
    </header>
  );
}

export default AppBarSys;
