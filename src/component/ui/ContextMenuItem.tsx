import { AllIconProps } from "@/types/*";
import Text from "@/components/ui/Text";
import SvgIcon from "@/components/ui/SvgIcon";
import Box from "@material-ui/core/Box";
import { TextVariantEnum } from "@/enums/*";
import theme from "@/styles/theme";

type Props = {
  title: string;
  icon: AllIconProps | undefined;
  iconColor?: string;
  danger?: boolean;
  [x: string]: any;
};

export default function ContextMenuItem({
  title,
  icon,
  iconColor = theme.palette.variation6.main,
  danger = false,
  ...props
}: Props) {
  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="row"
      alignContent="center"
      alignItems="center"
      justifyContent="flex-start"
    >
      {icon && (
        <SvgIcon
          icon={icon}
          htmlColor={!danger ? iconColor : theme.palette.danger.light}
          fontSize="small"
          {...props}
        />
      )}
      <Text
        style={{ marginLeft: 8, color: !danger ? iconColor : theme.palette.danger.light }}
        variant={TextVariantEnum.SUBTITLE2}
      >
        {title}
      </Text>
    </Box>
  );
}
