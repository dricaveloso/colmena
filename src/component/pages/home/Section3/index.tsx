import React from "react";
import Box from "@material-ui/core/Box";
import ToolbarSection from "../ToolbarSection";
import GalleryHorizontalScroll from "./GalleryHorizontalScroll";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "react-i18next";

interface Props {
  data: any;
}

export default function Section2({ data }: Props) {
  const { t } = useTranslation("home");

  return (
    <Box width="100%">
      <ToolbarSection title={t("section3Title")} link="/honeycomb" />
      <Divider marginTop={10} />
      <GalleryHorizontalScroll data={data} />
    </Box>
  );
}
