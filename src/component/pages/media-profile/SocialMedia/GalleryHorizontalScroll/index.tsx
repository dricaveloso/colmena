import React from "react";
import Box from "@material-ui/core/Box";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import theme from "@/styles/theme";
import IconButton from "@/components/ui/IconButton";

export default function GalleryHorizontalScroll() {
  const match = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Box width="100%" display="flex" flexDirection="row">
      <IconButton
        icon="plus_circle"
        iconColor={theme.palette.secondary.main}
        iconStyle={{ fontSize: 55 }}
        fontSizeIcon="large"
      />
      <div className="scrollingContainer" style={!match ? { width: "95vw" } : { width: 600 }}></div>
    </Box>
  );
}
