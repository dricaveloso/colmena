import React from "react";
import Box from "@material-ui/core/Box";
import SvgIcon from "@/components/ui/SvgIcon";

export default function ActionsToListItems() {
  return (
    <Box display="flex" justifyContent="flex-end">
      <SvgIcon icon="search" fontSize="small" />
      <SvgIcon icon="equalize" style={{ marginLeft: 7 }} fontSize="small" />
    </Box>
  );
}
