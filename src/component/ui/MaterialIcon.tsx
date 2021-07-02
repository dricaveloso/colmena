import React from "react";
import Icon from "@material-ui/core/Icon";

type Props = {
  icon: string;
  [x: string]: any;
};

function MaterialIcon({ icon, ...props }: Props) {
  return <Icon {...props}>{icon}</Icon>;
}

export default MaterialIcon;
