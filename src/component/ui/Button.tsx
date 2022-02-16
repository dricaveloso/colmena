import React from "react";
import Button from "@material-ui/core/Button";
import { ButtonColorProps, ButtonVariantProps, ButtonSizeProps } from "@/types/index";
import { ButtonVariantEnum, ButtonSizeEnum } from "@/enums/index";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "next-i18next";
import theme from "@/styles/theme";

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
  target?: string;
  [x: string]: any;
};

export default function Btn({
  title,
  color = undefined,
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
  target = "",
  download,
  ...props
}: Props) {
  const { t } = useTranslation("common");

  const styleBtn1 =
    !color && variant === "contained" && !disabled
      ? { backgroundColor: theme.palette.variation1.main, color: "#fff" }
      : {};

  const styleBtn2 =
    !color && variant === "outlined" && !disabled
      ? { borderColor: theme.palette.variation1.main, color: theme.palette.variation1.main }
      : {};

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
      style={{ textTransform: "lowercase", ...style, ...styleBtn1, ...styleBtn2 }}
      endIcon={endIcon}
      disabled={disabled}
      component="a"
      fullWidth={fullWidth}
      target={target}
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
      style={{ textTransform: "lowercase", ...style, ...styleBtn1, ...styleBtn2 }}
      variant={variant}
      color={color}
      size={size}
      onClick={handleClick}
      endIcon={endIcon}
      disabled={disabled}
      component={component}
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
  );
}
