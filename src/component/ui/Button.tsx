import React from "react";
import Button from "@material-ui/core/Button";
import { ButtonColorProps, ButtonVariantProps, ButtonSizeProps } from "@/types/index";
import { ButtonColorEnum, ButtonVariantEnum, ButtonSizeEnum } from "@/enums/index";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "next-i18next";

type Props = {
  title: string | React.ReactNode;
  color?: ButtonColorProps | undefined;
  variant?: ButtonVariantProps | undefined;
  handleClick?: (() => void) | Promise<() => void> | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  style?: Object;
  size?: ButtonSizeProps | undefined;
  endIcon?: string | null;
  disabled?: boolean;
  component?: any;
  url?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  type?: string;
  className?: string;
  download?: string;
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
  isLoading = false,
  className,
  type,
  download,
  ...props
}: Props) {
  const { t } = useTranslation("common");

  return url !== "no-navigation" ? (
    <Button
      download={download}
      href={url}
      className={className}
      variant={variant}
      color={color}
      size={size}
      // className="width-based-device"
      type={type}
      style={{ textTransform: "lowercase", ...style }}
      endIcon={endIcon}
      disabled={disabled}
      component="a"
      fullWidth={fullWidth}
      {...props}
    >
      {isLoading ? (
        <>
          <CircularProgress color="secondary" size={16} style={{ marginRight: 8 }} /> {t("loading")}
          ..
        </>
      ) : (
        <>{title}</>
      )}
    </Button>
  ) : (
    <Button
      className={className}
      // className="width-based-device"
      type={type}
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
      {isLoading ? (
        <>
          <CircularProgress color="secondary" size={16} style={{ marginRight: 8 }} /> {t("loading")}
          ..
        </>
      ) : (
        <>{title}</>
      )}
    </Button>
  );
}
