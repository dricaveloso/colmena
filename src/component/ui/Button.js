import React from "react";
import Button from "@material-ui/core/Button";

export default function Btn({
  title,
  color = "primary",
  naked = true,
  variant = "contained",
  handleClick = () => {},
}) {
  return (
    <Button
      style={{ textTransform: "capitalize" }}
      variant={variant}
      color={color}
      naked={naked}
      onClick={handleClick}
      className="blocked-button"
    >
      {title}
    </Button>
  );
}
