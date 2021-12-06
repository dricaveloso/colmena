import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { useTranslation } from "next-i18next";
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface } from "@/interfaces/index";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/index";
import FlexBox from "@/components/ui/FlexBox";
import { useRouter } from "next/router";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SwipeableViews from "react-swipeable-views";
import theme from "@/styles/theme";
import IconButton from "@/components/ui/IconButton";
import AppBar from "@material-ui/core/AppBar";
import InputSendMessage from "@/components/pages/honeycomb/Chat/InputSendMessage";
import ChatMessage from "@/components/pages/honeycomb/Chat";
import { sendChatMessage } from "@/services/talk/chat";
import { getRoomParticipants } from "@/services/talk/room";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["honeycomb"])),
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

function Honeycomb() {
  const { t } = useTranslation("honeycomb");

  const router = useRouter();
  const { params } = router.query;
  // const [scrollPosition, setScrollPosition] = useState(0);
  // const [tabFixedHeader, setTabFixedHeader] = useState({});

  // asljkd aslkdj slakdj slakdj laskdj slakdj

  // function handleScroll() {
  //   const position = window.pageYOffset;
  //   if (position >= 100) {
  //     setTabFixedHeader({
  //       position: "fixed",
  //       left: 0,
  //       top: 100,
  //     });
  //   } else setTabFixedHeader({});

  //   setScrollPosition(position);
  // }

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll, { passive: true });

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  const [value, setValue] = useState(0);
  const [showInputMessage, setShowInputMessage] = useState(true);

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
  const displayName = params[1];

  const { data } = getRoomParticipants(token, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  function prepareParticipantsString(qty: number) {
    if (qty === 0) return t("noMemberTitle");

    if (qty === 1) return `1 ${t("member")}`;

    return `${qty} ${t("members")}`;
  }

  async function sendMessageAPI(message: string) {
    await sendChatMessage(token, message);
  }

  return (
    <LayoutApp
      back
      title={displayName}
      subtitle={!data ? "..." : prepareParticipantsString(data.ocs.data.length)}
      showFooter={!showInputMessage}
      drawer={false}
      extraElement={<IconButton icon="more_vertical" iconColor="#fff" fontSizeIcon="medium" />}
    >
      <FlexBox
        justifyContent={JustifyContentEnum.FLEXSTART}
        extraStyle={{ padding: 0, margin: 0, backgroundColor: "#fff" }}
      >
        <Box width="100vw" style={{ paddingTop: 55 }}>
          <AppBar position="fixed" elevation={0} style={{ marginTop: 70 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              style={{ backgroundColor: "#fff", width: "100vw", color: theme.palette.icon.main }}
              variant="fullWidth"
            >
              <Tab
                label={
                  <IconButton
                    icon="chat"
                    iconStyle={{ fontSize: 20 }}
                    direction="horizontal"
                    color={theme.palette.icon.main}
                    textStyle={{ fontSize: 14 }}
                    title={t("tab1Title")}
                  />
                }
                {...a11yProps(0)}
              />
              <Tab
                label={
                  <IconButton
                    icon="library"
                    iconStyle={{ fontSize: 20 }}
                    direction="horizontal"
                    color={theme.palette.icon.main}
                    textStyle={{ fontSize: 14 }}
                    title={t("tab2Title")}
                  />
                }
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>

          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0}>
              <ChatMessage conversationName={displayName} token={token} />
            </TabPanel>
            <TabPanel value={value} index={1}></TabPanel>
          </SwipeableViews>
          {showInputMessage && (
            <InputSendMessage handleSendMessage={(message: string) => sendMessageAPI(message)} />
          )}
        </Box>
      </FlexBox>
    </LayoutApp>
  );
}

export default Honeycomb;
