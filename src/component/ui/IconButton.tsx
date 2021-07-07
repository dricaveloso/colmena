import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MaterialIcon from "component/ui/MaterialIcon";
import Text from "component/ui/Text";
import { TextVariantEnum, TextAlignEnum } from "enums";
import { TextVariantProps } from "types";

type Props = {
  title?: string | null;
  fontSizeIcon: string;
  variantTitle?: TextVariantProps;
  color?: string;
  handleClick?: () => void | undefined;
  icon: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  style?: object;
};

function IconButtonCtr({
  title = null,
  fontSizeIcon = "3.5em",
  variantTitle = TextVariantEnum.H5,
  color = "black",
  handleClick,
  icon,
}: Props) {
  const extraStyle = {
    fontSize: fontSizeIcon,
    color,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconButton
        disableRipple
        disableFocusRipple
        style={{ margin: 0, padding: 5, fontSize: fontSizeIcon, color }}
        onClick={handleClick}
      >
        <MaterialIcon icon={icon} style={{ ...extraStyle }} />
      </IconButton>
      {!!title && (
        <Text variant={variantTitle} align={TextAlignEnum.CENTER} gutterBottom>
          {title}
        </Text>
      )}
    </div>
  );
}

export default IconButtonCtr;
