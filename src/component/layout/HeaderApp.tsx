import React from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

function HeaderApp({ about = false }) {
  return (
    <Box>
      <Typography component="p" gutterBottom>
        Logo
      </Typography>
    </Box>
  );
}

export default HeaderApp;
