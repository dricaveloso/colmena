import React from "react";
import Image from "next/image";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { useTranslation } from "next-i18next";

export default function GoLive() {
  const { t } = useTranslation("call");

  return (
    <Box
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        top: 0,
        right: 0,
        marginTop: 70,
        marginRight: 10,
      }}
    >
      <Image src="/images/go_live.png" width={30} height={30} />
      <Text style={{ marginLeft: 5 }}>{t("goLiveTitle")}</Text>
    </Box>
  );
}
