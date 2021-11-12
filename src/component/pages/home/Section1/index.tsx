import React from "react";
import Box from "@material-ui/core/Box";
import theme from "@/styles/theme";
import UserAvatar from "@/components/ui/Avatar";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetter } from "@/utils/utils";
import Item from "./Item";

export default function Section1() {
  const { t } = useTranslation("home");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  return (
    <Box
      padding={3}
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
      style={{ backgroundColor: theme.palette.primary.main, width: "100%" }}
    >
      <UserAvatar size={10} name={userRdx?.user.name} />
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        marginLeft={2}
        justifyContent="flex-start"
      >
        <Text
          variant={TextVariantEnum.H6}
          style={{
            color: "#ffffff",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 7,
            textAlign: "left",
          }}
        >
          {capitalizeFirstLetter(userRdx?.user.name)}
        </Text>
        <Box
          display="flex"
          flexDirection="row"
          alignContent="center"
          justifyContent="space-between"
        >
          <Item title={t("myFilesLabel")} amount={0} />
          <Item title={t("sharedLabel")} amount={0} />
          <Item title={t("publicLabel")} amount={0} />
        </Box>
      </Box>
    </Box>
  );
}
