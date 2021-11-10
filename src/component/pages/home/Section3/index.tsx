import React from "react";
import Box from "@material-ui/core/Box";
import ToolbarSection from "../ToolbarSection";
import GalleryHorizontalScroll from "./GalleryHorizontalScroll";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "react-i18next";

export default function Section2() {
  const { t } = useTranslation("home");
  return (
    <Box width="100%">
      <ToolbarSection title={t("section3Title")} link="/algum-lugar" />
      <Divider marginTop={10} />
      <GalleryHorizontalScroll />
    </Box>
  );
}
