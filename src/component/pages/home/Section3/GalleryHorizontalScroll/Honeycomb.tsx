/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from "@material-ui/core/Box";
import { v4 as uuid } from "uuid";
import Text from "@/components/ui/Text";
import { TextDisplayEnum, TextVariantEnum } from "@/enums/*";
import Image from "next/image";
import theme from "@/styles/theme";
import { RoomItemInterface } from "@/interfaces/talk";
import { useEffect } from "react";

interface Props {
  title: string;
  image: string;
}

export default function Honeycomb({ title, image }: Props) {
  return (
    <Box
      width={80}
      key={uuid()}
      justifyContent="center"
      marginRight={2.5}
      alignItems="center"
      flex={1}
      display="flex"
      flexDirection="column"
    >
      <Image width={80} height={72} src={image} />
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
