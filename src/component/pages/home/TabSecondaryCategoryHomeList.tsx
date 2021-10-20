import React from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import VerticalList from "@/components/ui/VerticalList";
import { useTranslation } from "next-i18next";
import ActionsToListItems from "@/components/ui/ActionsToListItems";
import { EnvironmentEnum } from "@/enums/*";
import { LibraryItemInterface } from "@/interfaces/index";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
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

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function TabCategoryList() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation("home");

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const data: LibraryItemInterface[] = [
    {
      id: "1",
      basename: "Title Show",
      type: "document",
      environment: EnvironmentEnum.REMOTE,
    },
    {
      id: "2",
      basename: "Title Show",
      type: "document",
      environment: EnvironmentEnum.REMOTE,
    },
    {
      id: "3",
      basename: "Title Show",
      type: "document",
      environment: EnvironmentEnum.REMOTE,
    },
    {
      id: "4",
      basename: "Title Show",
      type: "document",
      environment: EnvironmentEnum.REMOTE,
    },
    {
      id: "5",
      basename: "Title Show",
      type: "document",
      environment: EnvironmentEnum.REMOTE,
    },
  ];

  return (
    <>
      <ActionsToListItems />
      <Tabs indicatorColor="primary" value={1} textColor="primary" variant="fullWidth">
        <Tab
          label={
            <span style={{ textAlign: "left", width: "100%" }}>{t("recentPublicationsTitle")}</span>
          }
          {...a11yProps(0)}
        />
      </Tabs>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <VerticalList data={data} />
        </TabPanel>
      </SwipeableViews>
    </>
  );
}
