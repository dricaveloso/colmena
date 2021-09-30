import React, { useState } from "react";
import Text from "@/components/ui/Text";
import { TextVariantEnum, TextAlignEnum } from "@/enums/index";
import { TextVariantProps, FontSizeIconProps, AllIconProps } from "@/types/index";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import SvgIcon from "@/components/ui/SvgIcon";
import theme from "@/styles/theme";

type Props = {
  icon: AllIconProps;
  title?: string | null;
  fontSizeIcon?: FontSizeIconProps;
  variantTitle?: TextVariantProps;
  color?: string;
  handleClick?: () => void | undefined;
  url?: string;
  download?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  iconStyle?: object;
  // eslint-disable-next-line @typescript-eslint/ban-types
  style?: object;
  className?: string;
};

function IconButtonCtr({
  icon,
  title = null,
  fontSizeIcon = "large",
  variantTitle = TextVariantEnum.H5,
  color = "black",
  url = "no-navigation",
  download = "",
  iconStyle = {},
  style = {},
  className = "",
  handleClick,
}: Props) {
  const [colorActive, setColorActive] = useState(color);
  const changeColorHandler = (status: boolean) => {
    setColorActive(status ? theme.palette.primary.light : color);
  };

  function showButtonWithConditions() {
    if (url !== "no-navigation" && !download)
      return (
        <Link href={url}>
          <Button
            component="a"
            style={{ background: "none", ...style }}
            onMouseOver={() => changeColorHandler(true)}
            onMouseOut={() => changeColorHandler(false)}
            className={className}
          >
            <SvgIcon
              icon={icon}
              htmlColor={colorActive}
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
          onMouseOver={() => changeColorHandler(true)}
          onMouseOut={() => changeColorHandler(false)}
          className={className}
        >
          <SvgIcon
            icon={icon}
            htmlColor={colorActive}
            fontSize={fontSizeIcon}
            style={{ ...iconStyle }}
          />
        </Button>
      );

    return (
      <Button
        style={{ background: "none", ...style }}
        onMouseOver={() => changeColorHandler(true)}
        onMouseOut={() => changeColorHandler(false)}
        onClick={handleClick}
        className={className}
      >
        <SvgIcon
          icon={icon}
          htmlColor={colorActive}
          fontSize={fontSizeIcon}
          style={{ ...iconStyle }}
        />
      </Button>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {showButtonWithConditions()}
      {!!title && (
        <Text variant={variantTitle} align={TextAlignEnum.CENTER} gutterBottom>
          {title}
        </Text>
      )}
    </div>
  );
}

export default IconButtonCtr;
