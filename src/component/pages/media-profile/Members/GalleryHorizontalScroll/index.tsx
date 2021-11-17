import React from "react";
import Box from "@material-ui/core/Box";
import theme from "@/styles/theme";
import IconButton from "@/components/ui/IconButton";
import Member from "./Member";

type Props = {
  handleOpenInviteForm: () => void;
};

export default function GalleryHorizontalScroll({ handleOpenInviteForm }: Props) {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      <IconButton
        icon="plus_circle"
        iconColor={theme.palette.secondary.main}
        iconStyle={{ fontSize: 60 }}
        fontSizeIcon="large"
        handleClick={handleOpenInviteForm}
        title="add"
        style={{ marginRight: 8 }}
        textStyle={{
          color: theme.palette.primary.dark,
          fontWeight: "bold",
          textAlign: "center",
          fontSize: 14,
        }}
      />
      <Member />
    </Box>
  );
}
