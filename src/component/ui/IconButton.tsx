// import React, { useState } from "react";
import React from "react";
import Text from "@/components/ui/Text";
import { TextVariantEnum, TextAlignEnum } from "@/enums/index";
import { TextVariantProps, FontSizeIconProps, AllIconProps } from "@/types/index";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import SvgIcon from "@/components/ui/SvgIcon";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";

type Props = {
  icon: AllIconProps;
  title?: string | null;
  fontSizeIcon?: FontSizeIconProps | number;
  variantTitle?: TextVariantProps;
  color?: string;
  iconColor?: string;
  handleClick?: ((event?: any) => void) | (() => void) | undefined;
  url?: string;
  download?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  iconStyle?: object;
  // eslint-disable-next-line @typescript-eslint/ban-types
  style?: object;
  className?: string;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  textStyle?: object;
  variant?: "text" | "outlined" | "contained" | undefined;
  size?: "small" | "medium";
  component?: "a" | "button";
};

function IconButtonCtr({
  icon,
  title = null,
  fontSizeIcon = "large",
  variantTitle = TextVariantEnum.H5,
  color = "black",
  iconColor = theme.palette.icon.main,
  url = "no-navigation",
  download = "",
  iconStyle = {},
  style = {},
  textStyle = {},
  className = "",
  variant = undefined,
  direction = "vertical",
  disabled = false,
  size = "medium",
  component = "button",
  handleClick,
  ...props
}: Props) {
  const svgIcon = (
    <SvgIcon icon={icon} htmlColor={iconColor} fontSize={fontSizeIcon} style={{ ...iconStyle }} />
  );

  const commonProperties = {
    className,
    variant,
    disabled,
    size,
    background: "none",
    style: { background: "none", ...style },
  };

  function showButtonWithConditions() {
    if (url !== "no-navigation" && !download)
      return (
        <Link href={url}>
          <Button component="a" {...commonProperties} {...props}>
            {svgIcon}
          </Button>
        </Link>
      );

    if (download)
      return (
        <Button component="a" download={download} href={url} {...commonProperties} {...props}>
          {svgIcon}
        </Button>
      );

    return (
      <Button onClick={handleClick} component={component} {...commonProperties} {...props}>
        {svgIcon}
      </Button>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection={direction === "vertical" ? "column" : "row"}
      justifyContent="center"
      alignItems="center"
    >
      {showButtonWithConditions()}
      {!!title && (
        <Text
          style={{ color, ...textStyle }}
          variant={variantTitle}
          align={TextAlignEnum.CENTER}
          gutterBottom
        >
          {title}
        </Text>
      )}
    </Box>
  );
}

export default IconButtonCtr;
