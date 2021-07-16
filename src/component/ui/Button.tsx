import Button from "@material-ui/core/Button";
import { ButtonColorProps, ButtonVariantProps, ButtonSizeProps } from "@/types/index";
import { ButtonColorEnum, ButtonVariantEnum, ButtonSizeEnum } from "@/enums/index";

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
};

export default function Btn({
  title,
  color = ButtonColorEnum.PRIMARY,
  variant = ButtonVariantEnum.CONTAINED,
  handleClick,
  style = {},
  size = ButtonSizeEnum.MEDIUM,
  endIcon = null,
  disabled = false,
}: Props) {
  return (
    <Button
      style={{ textTransform: "capitalize", ...style }}
      variant={variant}
      color={color}
      size={size}
      onClick={handleClick}
      className="width-based-device"
      endIcon={endIcon}
      disabled={disabled}
    >
      {title}
    </Button>
  );
}
