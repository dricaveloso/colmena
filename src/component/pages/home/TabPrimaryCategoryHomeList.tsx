import React from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import VerticalList from "@/components/ui/VerticalList";
import { useTranslation } from "next-i18next";
import ActionsToListItems from "@/components/ui/ActionsToListItems";
import Divider from "@/components/ui/Divider";

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

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const data = [
    {
      id: 1,
      title: "Title show",
      subtitle: "00:00 - by Author",
      img: "/images/radio_image.jpg",
      url: "/library",
    },
    {
      id: 2,
      title: "Title show",
      subtitle: "00:00 - by Author",
      img: "/images/radio_image.jpg",
      url: "/library",
    },
    {
      id: 3,
      title: "Title show",
      subtitle: "00:00 - by Author",
      img: "/images/radio_image.jpg",
      url: "/library",
    },
    {
      id: 4,
      title: "Title show",
      subtitle: "00:00 - by Author",
      img: "/images/radio_image.jpg",
      url: "/library",
    },
    {
      id: 5,
      title: "Title show",
      subtitle: "00:00 - by Author",
      img: "/images/radio_image.jpg",
      url: "/library",
    },
    {
      id: 6,
      title: "Title show",
      subtitle: "00:00 - by Author",
      img: "/images/radio_image.jpg",
      url: "/library",
    },
  ];

  return (
    <>
      <ActionsToListItems />
      <Divider marginTop={10} />
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label={t("tabTitle1")} {...a11yProps(0)} />
        <Tab label={t("tabTitle2")} {...a11yProps(1)} />
        <Tab label={t("tabTitle3")} {...a11yProps(2)} />
      </Tabs>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <VerticalList data={data} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <VerticalList data={data} />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <VerticalList data={data} />
        </TabPanel>
      </SwipeableViews>
    </>
  );
}
