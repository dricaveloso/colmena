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
  fontSizeIcon?: FontSizeIconProps;
  variantTitle?: TextVariantProps;
  color?: string;
  iconColor?: string;
  handleClick?: () => void | undefined;
  url?: string;
  download?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  iconStyle?: object;
  // eslint-disable-next-line @typescript-eslint/ban-types
  style?: object;
  className?: string;
  direction?: string;
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
}: Props) {
  // const [colorActive, setColorActive] = useState(color);
  // const changeColorHandler = (status: boolean) => {
  //   setColorActive(status ? theme.palette.primary.light : color);
  // };

  function showButtonWithConditions() {
    if (url !== "no-navigation" && !download)
      return (
        <Link href={url}>
          <Button
            component="a"
            style={{ background: "none", ...style }}
            // onMouseOver={() => changeColorHandler(true)}
            // onMouseOut={() => changeColorHandler(false)}
            className={className}
            variant={variant}
            disabled={disabled}
            size={size}
          >
            <SvgIcon
              icon={icon}
              htmlColor={iconColor}
              fontSize={fontSizeIcon}
              style={{ ...iconStyle }}
            />
          </Button>
        </Link>
      );

    if (download)
      return (
        <Button
          component="a"
          download={download}
          href={url}
          style={{ background: "none", ...style }}
          // onMouseOver={() => changeColorHandler(true)}
          // onMouseOut={() => changeColorHandler(false)}
          className={className}
          variant={variant}
          disabled={disabled}
          size={size}
        >
          <SvgIcon
            icon={icon}
            htmlColor={iconColor}
            fontSize={fontSizeIcon}
            style={{ ...iconStyle }}
          />
        </Button>
      );

    return (
      <Button
        style={{ background: "none", ...style }}
        // onMouseOver={() => changeColorHandler(true)}
        // onMouseOut={() => changeColorHandler(false)}
        onClick={handleClick}
        className={className}
        component={component}
        variant={variant}
        size={size}
        disabled={disabled}
      >
        <SvgIcon
          icon={icon}
          htmlColor={iconColor}
          fontSize={fontSizeIcon}
          style={{ ...iconStyle }}
        />
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
