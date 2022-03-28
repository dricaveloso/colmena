/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-bind */
import React, { useCallback, useState } from "react";
import Box from "@material-ui/core/Box";
import { useTranslation } from "next-i18next";
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface } from "@/interfaces/index";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum, TextVariantEnum, HoneycombContextOptions } from "@/enums/index";
import FlexBox from "@/components/ui/FlexBox";
import { useRouter } from "next/router";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SwipeableViews from "react-swipeable-views";
import theme from "@/styles/theme";
import AppBar from "@material-ui/core/AppBar";
import InputSendMessage from "@/components/pages/honeycomb/Chat/InputSendMessage";
import { MemoizedChat } from "@/components/pages/honeycomb/Chat";
import ReloadChatMessages from "@/components/pages/honeycomb/Chat/ReloadChatMessages";
import Subtitle from "@/components/pages/honeycomb/Subtitle";
import { sendChatMessage } from "@/services/talk/chat";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import HoneycombLibrary from "@/components/pages/honeycomb/HoneycombLibrary";
import SvgIcon from "@/components/ui/SvgIcon";
import Text from "@/components/ui/Text";
import { AllIconProps, PropsUserSelector } from "@/types/*";
import ContextMenu from "@/components/pages/honeycomb/Chat/ContextMenu";
import HoneycombAvatar from "@/components/pages/home/Section3/HoneycombList/Honeycomb";
import { makeStyles } from "@material-ui/core";
import { getRoomParticipants } from "@/services/talk/room";
import { RoomParticipant } from "@/interfaces/talk";
import { listUsersByGroup } from "@/services/ocs/groups";
import { getUserGroup, isModerator } from "@/utils/permissions";
import { useSelector, useDispatch } from "react-redux";
import { setLibraryPath } from "@/store/actions/library";
import { findGroupFolderByPath } from "@/utils/utils";
import classNames from "classnames";
import IconButton from "@/components/ui/IconButton";
import { toast } from "@/utils/notifications";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["honeycomb", "library"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

const useStyles = makeStyles(() => ({
  container: {
    padding: 0,
    margin: 0,
    backgroundColor: "#fff",
  },
  appBar: {
    marginTop: 70,
    height: 40,
    backgroundColor: theme.palette.primary.main,
  },
  tabs: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100vw",
    color: theme.palette.icon.main,
  },
  paddingTopAppBarBox: {
    paddingTop: 55,
  },
  avatar: {
    marginRight: 10,
  },
}));

function Honeycomb() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation("honeycomb");
  const { t: l } = useTranslation("library");
  const { t: c } = useTranslation("common");
  const router = useRouter();
  const { params } = router.query;

  const [value, setValue] = useState(0);
  const [showInputMessage, setShowInputMessage] = useState(true);
  const [showReloadMessages, setShowReloadMessages] = useState(false);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setShowInputMessage(newValue === 0);
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  function a11yProps(index: any) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }

  if (!params) {
    router.back();
    return null;
  }

  const token = params[0];
  const displayName: string = params[1];
  const canDeleteConversation = Number(params[2]);

  (async () => {
    let path = displayName;
    if (!canDeleteConversation) {
      const isGroupFolder = await findGroupFolderByPath(displayName);
      if (!isGroupFolder) {
        path = `${l("talkFolderName")}/${displayName}`;
      }
    }

    dispatch(setLibraryPath(path));
  })();

  async function sendMessageAPI(message: string, referenceId: string) {
    await sendChatMessage(token, message, referenceId);
  }

  const group = getUserGroup();
  const { data } = listUsersByGroup(group, "", {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const { data: part } = getRoomParticipants(token, "", {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  let participantsAddedHoneycomb: RoomParticipant[] = [];
  if (data && data.ocs && part && part.ocs) {
    participantsAddedHoneycomb = part.ocs.data;
  }

  const getTabOption = (title: string, icon: AllIconProps) => (
    <Box className={classNames("flex justify-center items-center space-s-2")}>
      <SvgIcon icon={icon} htmlColor="#727272" fontSize="small" />
      <Text variant={TextVariantEnum.CAPTION}>{title}</Text>
    </Box>
  );

  const unavailable = () => {
    toast(c("featureUnavailable"), "warning");
  };

  const leftExtraElement = (
    <Box className={classes.avatar}>
      <HoneycombAvatar
        fontSize={18}
        width={46}
        height={39}
        displayName={displayName}
        canDeleteConversation={canDeleteConversation > 0}
        token={token}
        canChangeAvatar={isModerator(participantsAddedHoneycomb, userRdx.user.id) !== undefined}
      />
    </Box>
  );

  const handleShowReloadMessages = useCallback(() => {
    setShowReloadMessages(true);
  }, []);

  return (
    <LayoutApp
      back
      title={displayName}
      fontSizeTitle={16}
      subtitle={<Subtitle token={token} />}
      fontSizeSubtitle={12}
      drawer={false}
      leftExtraElement={leftExtraElement}
      extraElement={
        <Box display="flex" flex={1} justifyContent="flex-end">
          <IconButton
            icon="call"
            iconColor="white"
            style={{ padding: 0, marginRight: 10, minWidth: 30 }}
            iconStyle={{ fontSize: 28 }}
            handleClick={unavailable}
          />
          <ContextMenu
            token={token}
            handleFallbackLeaveConversation={() => router.push("/honeycomb")}
            blackList={[HoneycombContextOptions.ARCHIVE_CONVERSATION]}
          />
        </Box>
      }
    >
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} className={classes.container}>
        <Box width="100vw" className={classes.paddingTopAppBarBox}>
          <AppBar position="fixed" elevation={0} className={classes.appBar}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              className={classes.tabs}
              variant="fullWidth"
            >
              <Tab label={getTabOption(t("tab1Title"), "chat")} {...a11yProps(0)} />
              <Tab label={getTabOption(t("tab2Title"), "library")} {...a11yProps(1)} />
            </Tabs>
          </AppBar>

          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0}>
              {showReloadMessages && <ReloadChatMessages token={token} />}
              <MemoizedChat
                token={token}
                conversationName={displayName}
                canDeleteConversation={canDeleteConversation}
                handleShowReloadMessages={handleShowReloadMessages}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              {value === 1 && (
                <HoneycombLibrary
                  conversationName={displayName}
                  canDeleteConversation={canDeleteConversation}
                />
              )}
            </TabPanel>
          </SwipeableViews>
          {showInputMessage && (
            <InputSendMessage token={token} handleSendMessage={sendMessageAPI} />
          )}
        </Box>
      </FlexBox>
    </LayoutApp>
  );
}

export default Honeycomb;
