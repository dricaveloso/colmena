/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from "@material-ui/core/Box";
import { v4 as uuid } from "uuid";
import Text from "@/components/ui/Text";
import { TextDisplayEnum, TextVariantEnum } from "@/enums/*";
import Image from "next/image";
import theme from "@/styles/theme";
import SvgIcon from "@/components/ui/SvgIcon";
import { AllIconProps } from "@/types/*";

type Props = {
  title: string;
  icon: AllIconProps;
  fontSize?: number;
  iconColor?: string;
};

export default function SocialMediaItem({
  title,
  icon,
  fontSize = 64,
  iconColor = "#343A40",
}: Props) {
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
      margin={1}
      width={70}
    >
      <SvgIcon icon={icon} style={{ fontSize }} htmlColor={iconColor} />
      <Text
        variant={TextVariantEnum.SUBTITLE1}
        display={TextDisplayEnum.BLOCK}
        noWrap
        style={{
          color: theme.palette.primary.dark,
          fontWeight: "bold",
          textAlign: "center",
          fontSize: 14,
        }}
      >
        {title}
      </Text>
    </Box>
  );
}
