import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import SvgIcon from "@/components/ui/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
import { PositionProps, PropsRecordingSelector, PropsTransferSelector } from "@/types/index";
import { PositionEnum, TextVariantEnum, TextAlignEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import { useSelector, useDispatch } from "react-redux";
import Drawer from "./GeneralMenuDrawer";
import { useRouter } from "next/router";
import theme from "@/styles/theme";
import { updateRecordingState } from "@/store/actions/recordings/index";
import { setOpenTransferModal } from "@/store/actions/transfers/index";
import { setBackAfterFinishRecording } from "@/utils/utils";
import { TransferItemInterface } from "@/interfaces/index";

export interface AppBarInterface {
  title: string;
  fontSizeTitle?: number;
  subtitle?: string | React.ReactNode;
  fontSizeSubtitle?: number;
  drawer?: boolean;
  back?: boolean;
  headerPosition?: PositionProps | undefined;
  templateHeader?: "variation1" | "variation2" | "variation3";
  extraElement?: React.ReactNode | undefined;
  showUploadProgress?: boolean;
}

export const tplHeader = new Map();
tplHeader.set("variation1", {
  backgroundAppBar: "#fff",
  textColor: "#292929",
});
tplHeader.set("variation2", {
  backgroundAppBar: theme.palette.primary.main,
  textColor: theme.palette.primary.contrastText,
});
tplHeader.set("variation3", {
  backgroundAppBar: theme.palette.variation7.dark,
  textColor: theme.palette.variation5.contrastText,
});

function AppBarSys({
  title,
  fontSizeTitle = 20,
  subtitle,
  fontSizeSubtitle = 15,
  headerPosition = PositionEnum.FIXED,
  drawer = true,
  back = false,
  templateHeader = "variation2",
  extraElement = undefined,
  showUploadProgress = true,
}: AppBarInterface) {
  const router = useRouter();
  const recordingRdx = useSelector(
    (state: { recording: PropsRecordingSelector }) => state.recording,
  );
  const transferRdx = useSelector((state: { transfer: PropsTransferSelector }) => state.transfer);
  const dispatch = useDispatch();

  const [openDrawer, setOpenDrawer] = useState(false);

  const backTo = (backPage: string | null) => {
    if (backPage) router.push(backPage);
    else router.back();
  };

  const handleBack = async () => {
    let backPage: null | string = null;
    const isChangedLanguage = await localStorage.getItem("isChangedLanguage");
    if (isChangedLanguage === "yes") {
      const pages = await localStorage.getItem("accessedPages");
      const pagesAc: string[] = JSON.parse(String(pages));
      // eslint-disable-next-line prefer-destructuring
      backPage = pagesAc[1] || null;
      await localStorage.setItem("isChangedLanguage", "no");
    }

    if (router.pathname === "/recording") {
      if (recordingRdx.activeRecordingState === "START") {
        setBackAfterFinishRecording("yes");
        dispatch(updateRecordingState("STOP"));
      } else {
        backTo(backPage);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      backTo(backPage);
    }
  };

  const transferWorkInProgress = transferRdx.files.some(
    (item: TransferItemInterface) => item.status === "in progress",
  );

  const subtitleColor = "#fbe1b7";

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
                  fontSize: fontSizeTitle,
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
                    fontSize: fontSizeSubtitle,
                    color: subtitleColor,
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
            {transferWorkInProgress && showUploadProgress && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="transfer"
                data-testid="open-transfer-modal"
                style={{ marginLeft: 2 }}
                onClick={() => dispatch(setOpenTransferModal(true))}
              >
                <SvgIcon icon="transfer" htmlColor={subtitleColor} fontSize="medium" />
              </IconButton>
            )}
            {drawer && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                data-testid="open-burguer-menu"
                style={{ marginLeft: 4 }}
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
