import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
// import HomeTab from "@/components/ui/FooterApp/HomeTab";
import AppTab from "@/components/ui/FooterApp/AppTab";
import { useRouter } from "next/router";
import Box from "@material-ui/core/Box";

type StyleProps = {
  width?: string;
  margin?: string;
};

function FooterApp() {
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.up("sm"));
  const style: StyleProps = {};
  const router = useRouter();

  if (match) {
    style.width = "65vw";
    style.margin = "0 auto";
  }

  return (
    <>
      <Box width="100%" pb={3} />
      <div className="footer" style={{ backgroundColor: "#fff", margin: 0, padding: 2 }}>
        <Box
          display="flex"
          style={{ margin: 0, ...style }}
          flexDirection="row"
          flexWrap="nowrap"
          justifyContent="space-around"
        >
          <AppTab page={router.route} />
        </Box>
      </div>
    </>
  );
}

export default FooterApp;
