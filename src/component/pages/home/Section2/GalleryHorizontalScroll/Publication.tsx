/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from "@material-ui/core/Box";
import { v4 as uuid } from "uuid";
import Text from "@/components/ui/Text";
import { TextDisplayEnum, TextVariantEnum } from "@/enums/*";

type Props = {
  category?: string;
  title: string;
  subtitle: string;
  url?: string;
  image: string;
};

export default function Publication({
  category = "teste",
  title,
  subtitle,
  url = "teste",
  image,
}: Props) {
  const width = 182;
  const height = 182;
  return (
    <Box
      key={uuid()}
      marginRight={1}
      width={width}
      paddingBottom={1}
      height={height}
      display="flex"
      flexDirection="column"
      style={{
        backgroundImage: `url('${image}')`,
        position: "relative",
      }}
    >
      <Box width={width} height={height * 0.68}></Box>
      <Box
        display="flex"
        padding={1}
        width={width}
        flexDirection="column"
        alignItems="center"
        height={height * 0.3}
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          float: "left",
          bottom: 0,
          left: 0,
        }}
      >
        <Text
          variant={TextVariantEnum.SUBTITLE1}
          display={TextDisplayEnum.BLOCK}
          noWrap
          style={{
            color: "#fff",
            fontWeight: "bold",
            textAlign: "left",
            fontSize: 14,
          }}
        >
          {title}
        </Text>
        <Text
          variant={TextVariantEnum.SUBTITLE2}
          style={{ color: "#fff", textAlign: "left", fontSize: 12 }}
        >
          {subtitle}
        </Text>
      </Box>
    </Box>
  );
}
