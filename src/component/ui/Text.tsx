import React from "react";
import { Typography } from "@material-ui/core";

function Text({ variant = "caption", align = "left", style = {}, children }) {
  return (
    <Typography variant={variant} align={align} style={style} gutterBottom>
      {children}
    </Typography>
  );
}

export default Text;
