import React from "react";
import Icon from "@material-ui/core/Icon";

function MaterialIcon({ icon, ...props }) {
  return <Icon {...props}>{icon}</Icon>;
}

export default MaterialIcon;
