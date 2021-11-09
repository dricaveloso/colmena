import React from "react";
import Box from "@material-ui/core/Box";
import ToolbarSection from "../../home/ToolbarSection";
import GalleryHorizontalScroll from "./GalleryHorizontalScroll";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "react-i18next";

export default function Members() {
  const { t } = useTranslation("common");
  return (
    <Box width="100%">
      <ToolbarSection
        seeAllTitle={t("manageTitle")}
        title={t("membersTitle")}
        link="/algum-lugar"
      />
      <Divider marginTop={10} />
      <GalleryHorizontalScroll />
    </Box>
  );
}
