import Button from "@material-ui/core/Button";
import { ButtonColorProps, ButtonVariantProps, ButtonSizeProps } from "@/types/index";
import { ButtonColorEnum, ButtonVariantEnum, ButtonSizeEnum } from "@/enums/index";
import Link from "next/link";

type Props = {
  title: string;
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
}: Props) {
  return url !== "no-navigation" ? (
    <Link href={url}>
      <Button
        variant={variant}
        color={color}
        size={size}
        // className="width-based-device"
        style={{ textTransform: "capitalize", ...style }}
        endIcon={endIcon}
        disabled={disabled}
        component="a"
      >
        {title}
      </Button>
    </Link>
  ) : (
    <Button
      // className="width-based-device"
      style={{ textTransform: "capitalize", ...style }}
      variant={variant}
      color={color}
      size={size}
      onClick={handleClick}
      endIcon={endIcon}
      disabled={disabled}
      component={component}
    >
      {title}
    </Button>
  );
}
