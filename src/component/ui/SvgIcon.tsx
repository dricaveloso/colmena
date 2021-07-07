import React, { useState } from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import SvgIconPath from "component/ui/SvgIconPath";

type Props = {
  icon: string;
  fontSize?: "default" | "inherit" | "large" | "small";
  htmlColor?: string;
  titleAccess?: string;
  viewBox?: string;
};

function SvgIconAux({ icon, fontSize = "large", htmlColor = "#000", titleAccess = "" }: Props) {
  const [viewBox, setViewBox] = useState("0 0 24 24");

  const updateViewboxHandler = (vb: string) => {
    setViewBox(vb);
  };

  return (
    <SvgIcon viewBox={viewBox} fontSize={fontSize} htmlColor={htmlColor} titleAccess={titleAccess}>
      <SvgIconPath icon={icon} updateViewboxHandler={updateViewboxHandler} color={htmlColor} />
    </SvgIcon>
  );
}
export default SvgIconAux;
