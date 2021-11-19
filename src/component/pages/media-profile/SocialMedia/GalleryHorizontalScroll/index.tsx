import React from "react";
import Box from "@material-ui/core/Box";
import theme from "@/styles/theme";
import IconButton from "@/components/ui/IconButton";
import Image from "next/image";

export default function GalleryHorizontalScroll() {
  return (
    <Box width="100%" display="flex" flexDirection="row">
      <IconButton
        icon="plus_circle"
        iconColor={theme.palette.secondary.main}
        iconStyle={{ fontSize: 60 }}
        fontSizeIcon="large"
        title="add"
        style={{ marginRight: 8 }}
        textStyle={{
          color: theme.palette.primary.dark,
          fontWeight: "bold",
          textAlign: "center",
          fontSize: 14,
        }}
      />
      <div style={{ marginTop: 5 }}>
        <Image width={60} height={60} src="/images/facebookLogo.png" layout="fixed" />
      </div>
    </Box>
  );
}
