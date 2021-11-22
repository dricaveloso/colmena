/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from "@material-ui/core/Box";
import { v4 as uuid } from "uuid";
import Text from "@/components/ui/Text";
import { TextDisplayEnum, TextVariantEnum } from "@/enums/*";
import Image from "next/image";
import theme from "@/styles/theme";
import UserAvatar from "@/components/ui/Avatar";

type Props = {
  title: string;
  urlImage?: string | null;
};

export default function Member({ title, urlImage = null }: Props) {
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
      margin={1}
      width={70}
    >
      <UserAvatar size={9} name={title} image={!urlImage ? "/images/user.png" : urlImage} />
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
