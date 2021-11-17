/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from "@material-ui/core/Box";
import { v4 as uuid } from "uuid";
import Text from "@/components/ui/Text";
import { TextDisplayEnum, TextVariantEnum } from "@/enums/*";
import Image from "next/image";
import theme from "@/styles/theme";

type Props = {
  title?: string;
  url?: string;
};

export default function Member({ title = "Ana", url = "teste" }: Props) {
  return (
    <Box
      key={uuid()}
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
    >
      <Image width={60} height={60} src="/images/member.png" />
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
