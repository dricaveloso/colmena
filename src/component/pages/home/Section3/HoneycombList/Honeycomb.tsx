/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from "@material-ui/core/Box";
import { v4 as uuid } from "uuid";
import Text from "@/components/ui/Text";
import { TextDisplayEnum, TextVariantEnum } from "@/enums/*";
import Image from "next/image";
import theme from "@/styles/theme";

interface Props {
  title?: string;
  image: string;
  showTitle?: boolean;
  width?: number;
  height?: number;
}

export default function Honeycomb({
  title,
  image,
  showTitle = true,
  width = 65,
  height = 57,
}: Props) {
  return (
    <Box
      width={width}
      key={uuid()}
      justifyContent="center"
      alignItems="center"
      flex={1}
      display="flex"
      flexDirection="column"
    >
      <Image width={width} height={height} src={image} />
      {showTitle && (
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
      )}
    </Box>
  );
}
