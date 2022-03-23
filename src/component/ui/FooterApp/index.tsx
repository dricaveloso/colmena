import React, { useState, useEffect } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
// import HomeTab from "@/components/ui/FooterApp/HomeTab";
import AppTab from "@/components/ui/FooterApp/AppTab";
import { useRouter } from "next/router";
import Box from "@material-ui/core/Box";
import { currentDirection } from "@/utils/i18n";
import { makeStyles } from "@material-ui/styles";

type StyleProps = {
  width?: string;
  margin?: string;
};

const useStyles = makeStyles({
  footerItemsRtl: {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  footerItemsLtr: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-around",
  },
});
function FooterApp() {
  const classes = useStyles();
  const [language, setLanguage] = useState("");
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.up("sm"));
  const style: StyleProps = {};
  const router = useRouter();

  useEffect(() => {
    setLanguage(currentDirection());
  }, [language]);
  if (match) {
    style.width = "65vw";
    style.margin = "0 auto";
  }

  return (
    <>
      <Box style={{ width: "100%", paddingBottom: 48 }} />
      <div className="footer" style={{ backgroundColor: "#fff", margin: 0, padding: 2 }}>
        <Box
          style={{ margin: 0, ...style }}
          className={language === "rtl" ? classes.footerItemsRtl : classes.footerItemsLtr}
        >
          <AppTab page={router.route} />
        </Box>
      </div>
    </>
  );
}

export default FooterApp;
