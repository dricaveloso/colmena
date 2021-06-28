import React from "react";
import { IconButton, Typography } from "@material-ui/core";
import MaterialIcon from "component/ui/MaterialIcon";

function IconButtonCtr({
  title = null,
  fontSizeIcon = "3.5em",
  variantTitle = "h5",
  color = "black",
  handleClick = null,
  icon,
  style = {},
}) {
  const extraStyle = {
    fontSize: fontSizeIcon,
    color,
    ...style,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <IconButton
        style={{ margin: 0, padding: 5, fontSize: fontSizeIcon, color }}
        onClick={handleClick}
      >
        <MaterialIcon icon={icon} style={{ ...extraStyle }} />
      </IconButton>
      {!!title && (
        <Typography component={variantTitle} align="center" gutterBottom>
          {title}
        </Typography>
      )}
    </div>
  );
}

export default IconButtonCtr;
