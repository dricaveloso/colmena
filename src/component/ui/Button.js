import React from "react";
import Button from "@material-ui/core/Button";

export default function Btn({
  title,
  color = "primary",
  naked = true,
  variant = "contained",
  handleClick = () => {},
  style = {},
  size = "medium",
  block = false,
  endIcon = null,
}) {
  return (
    <Button
      style={{ textTransform: "capitalize", ...style }}
      variant={variant}
      color={color}
      naked={naked.toString()}
      size={size}
      block={block.toString()}
      onClick={handleClick}
      className="width-based-device"
      endIcon={endIcon}
    >
      {title}
    </Button>
  );
}
