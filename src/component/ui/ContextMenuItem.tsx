import { AllIconProps } from "@/types/*";
import Text from "@/components/ui/Text";
import SvgIcon from "@/components/ui/SvgIcon";
import Box from "@material-ui/core/Box";
import { TextVariantEnum } from "@/enums/*";

type Props = {
  title: string;
  icon: AllIconProps | undefined;
};

export default function ContextMenuItem({ title, icon }: Props) {
  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="row"
      alignContent="center"
      justifyContent="flex-start"
    >
      {icon && <SvgIcon icon={icon} fontSize="small" />}
      <Text style={{ marginLeft: 8 }} variant={TextVariantEnum.SUBTITLE2}>
        {title}
      </Text>
    </Box>
  );
}
