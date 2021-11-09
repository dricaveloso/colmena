import React from "react";
import Box from "@material-ui/core/Box";
import Honeycomb from "./Honeycomb";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import theme from "@/styles/theme";
import { v4 as uuid } from "uuid";
import { useTranslation } from "react-i18next";

export default function GalleryHorizontalScroll() {
  const { t } = useTranslation("home");
  const match = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Box width="100%">
      <div className="scrollingContainer" style={!match ? { width: "95vw" } : { width: 600 }}>
        {[0, 1, 2, 3, 4, 5].map((_, idx) => (
          <div key={uuid()}>
            <Honeycomb
              title={t("exampleHoneycombTitle", { num: idx + 1 })}
              image={`/images/honeycombs/example${idx + 1}.png`}
            />
          </div>
        ))}
      </div>
    </Box>
  );
}
