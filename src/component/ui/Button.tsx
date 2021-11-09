import React from "react";
import Button from "@material-ui/core/Button";
import { ButtonColorProps, ButtonVariantProps, ButtonSizeProps } from "@/types/index";
import { ButtonColorEnum, ButtonVariantEnum, ButtonSizeEnum } from "@/enums/index";
import Link from "next/link";

type Props = {
  title: string | React.ReactNode;
  color?: ButtonColorProps | undefined;
  variant?: ButtonVariantProps | undefined;
  handleClick?: () => void | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  style?: Object;
  size?: ButtonSizeProps | undefined;
  endIcon?: string | null;
  disabled?: boolean;
  component?: any;
  url?: string;
  fullWidth?: boolean;
};

export default function Btn({
  title,
  color = ButtonColorEnum.SECONDARY,
  variant = ButtonVariantEnum.CONTAINED,
  handleClick,
  style = {},
  size = ButtonSizeEnum.LARGE,
  endIcon = null,
  disabled = false,
  component = "button",
  url = "no-navigation",
  fullWidth = false,
}: Props) {
  return url !== "no-navigation" ? (
    <Link href={url}>
      <Button
        variant={variant}
        color={color}
        size={size}
        // className="width-based-device"
        style={{ textTransform: "lowercase", ...style }}
        endIcon={endIcon}
        disabled={disabled}
        component="a"
        fullWidth={fullWidth}
      >
        {title}
      </Button>
    </Link>
  ) : (
    <Button
      // className="width-based-device"
      style={{ textTransform: "lowercase", ...style }}
      variant={variant}
      color={color}
      size={size}
      onClick={handleClick}
      endIcon={endIcon}
      disabled={disabled}
      component={component}
      fullWidth={fullWidth}
    >
      {title}
    </Button>
  );
}
