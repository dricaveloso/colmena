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
};

export default function ContextMenuItem({
  title,
  icon,
  iconColor = theme.palette.variation6.main,
}: Props) {
  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="row"
      alignContent="center"
      justifyContent="flex-start"
    >
      {icon && <SvgIcon icon={icon} htmlColor={iconColor} fontSize="small" />}
      <Text style={{ marginLeft: 8, color: iconColor }} variant={TextVariantEnum.SUBTITLE2}>
        {title}
      </Text>
    </Box>
  );
}
