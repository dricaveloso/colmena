import React from "react";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import FlexBox from "@/components/ui/FlexBox";
import Box from "@material-ui/core/Box";
import HoneycombList from "@/components/pages/honeycomb/ItemList";
import { JustifyContentEnum } from "@/enums/index";
import { getUsersConversations } from "@/services/talk/room";
import { useTranslation } from "next-i18next";
import FileListSkeleton from "@/components/ui/skeleton/FileList";
import { setHoneycombs } from "@/store/actions/honeycomb/index";
import { useDispatch } from "react-redux";
import AlertInfoCenter from "@/components/ui/AlertInfoCenter";
import { RoomItemInterface } from "@/interfaces/talk";
// import Tabs from "@material-ui/core/Tabs";
// import Tab from "@material-ui/core/Tab";
// import SwipeableViews from "react-swipeable-views";
// import theme from "@/styles/theme";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["honeycomb"])),
  },
});

export const filterHoneycombs = (honeycombs: RoomItemInterface[]) => {
  if (!honeycombs) {
    return honeycombs;
  }

  return honeycombs.filter((honeycomb: RoomItemInterface) => honeycomb.type !== 4);
};

export default function Honeycomb() {
  const dispatch = useDispatch();
  const { data, error } = getUsersConversations();

  if (!data && !error)
    return (
      <LayoutWrapper>
        <FileListSkeleton />
      </LayoutWrapper>
    );

  if (error)
    return (
      <LayoutWrapper>
        <AlertInfoCenter />
      </LayoutWrapper>
    );

  const honeycombs: RoomItemInterface[] = filterHoneycombs(data.ocs.data);
  dispatch(setHoneycombs(honeycombs));

  return (
    <LayoutWrapper>
      <HoneycombList />
    </LayoutWrapper>
  );
}

type LayoutWrapperProps = {
  children: React.ReactNode;
};

// interface TabPanelProps {
//   children?: React.ReactNode;
//   dir?: string;
//   index: any;
//   value: any;
// }

function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { t } = useTranslation("honeycomb");
  // const [value, setValue] = useState(0);

  // eslint-disable-next-line @typescript-eslint/ban-types
  // const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
  //   setValue(newValue);
  // };

  // const handleChangeIndex = (index: number) => {
  //   setValue(index);
  // };

  // function a11yProps(index: any) {
  //   return {
  //     id: `full-width-tab-${index}`,
  //     "aria-controls": `full-width-tabpanel-${index}`,
  //   };
  // }

  // function TabPanel(props: TabPanelProps) {
  //   const { children, value, index, ...other } = props;

  //   return (
  //     <div
  //       role="tabpanel"
  //       hidden={value !== index}
  //       id={`full-width-tabpanel-${index}`}
  //       aria-labelledby={`full-width-tab-${index}`}
  //       {...other}
  //     >
  //       {value === index && <Box>{children}</Box>}
  //     </div>
  //   );
  // }

  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0, margin: 0 }}>
        <Box width="100%">
          {/* <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        style={{ color: "#fff", backgroundColor: theme.palette.primary.main }}
        variant="fullWidth"
      >
        <Tab
          label={`${t("tab1Title")} ${!data ? "" : `(${data.ocs.data.length})`}`}
          {...a11yProps(0)}
        />
        <Tab label={`${t("tab2Title")}`} {...a11yProps(1)} />
      </Tabs>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={value}> */}
          {children}
          {/* </TabPanel>
        <TabPanel value={value} index={value}>
          <ItemList items={[]} />
        </TabPanel>
      </SwipeableViews> */}
        </Box>
      </FlexBox>
    </LayoutApp>
  );
}
