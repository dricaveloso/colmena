import React from "react";
import Box from "@material-ui/core/Box";
import Publication from "./Publication";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import theme from "@/styles/theme";
import { useTranslation } from "react-i18next";

export default function GalleryHorizontalScroll() {
  const { t } = useTranslation("common");
  const match = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Box width="100%">
      <div className="scrollingContainer" style={!match ? { width: "95vw" } : { width: 600 }}>
        <Publication
          title={t("examplePostTitle", { num: 1 })}
          subtitle={t("examplePostSubtitle")}
          image="/images/post1.png"
        />
        <Publication
          title={t("examplePostTitle", { num: 2 })}
          subtitle={t("examplePostSubtitle")}
          image="/images/post2.png"
        />
      </div>
    </Box>
  );
}
