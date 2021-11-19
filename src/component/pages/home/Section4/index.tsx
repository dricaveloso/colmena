import React from "react";
import Box from "@material-ui/core/Box";
import ToolbarSection from "../ToolbarSection";
import Divider from "@/components/ui/Divider";
import ItemList from "@/components/pages/library/ItemList";
import { LibraryItemInterface, TimeDescriptionInterface } from "@/interfaces/index";
import { EnvironmentEnum, ListTypeEnum } from "@/enums/index";
import { v4 as uuid } from "uuid";
import { dateDescription } from "@/utils/utils";
import { useTranslation } from "react-i18next";

export default function Section2() {
  const { t: c } = useTranslation("common");
  const { t } = useTranslation("home");
  const timeDescription: TimeDescriptionInterface = c("timeDescription", { returnObjects: true });
  const items: Array<LibraryItemInterface> = [
    {
      basename: t("exampleFileTitle", { num: 1 }),
      id: uuid(),
      type: "audio",
      environment: EnvironmentEnum.REMOTE,
      extension: "ogg",
      createdAt: new Date(),
      createdAtDescription: dateDescription(new Date(), timeDescription),
    },
    {
      basename: t("exampleFileTitle", { num: 2 }),
      id: uuid(),
      type: "audio",
      environment: EnvironmentEnum.REMOTE,
      extension: "ogg",
      createdAt: new Date(),
      createdAtDescription: dateDescription(new Date(), timeDescription),
    },
  ];
  return (
    <Box width="100%">
      <ToolbarSection title={t("section4Title")} link="/algum-lugar" />
      <Divider marginTop={10} />
      <ItemList items={items} type={ListTypeEnum.LIST} />
    </Box>
  );
}
