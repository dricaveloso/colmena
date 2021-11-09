import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";

type Props = {
  title: string;
  amount: number | undefined;
};

export default function Item({ title, amount }: Props) {
  return (
    <Box>
      <Text variant={TextVariantEnum.BODY2} style={{ color: "#D2D3DC" }}>
        {title}
      </Text>
      <Text variant={TextVariantEnum.H6} style={{ color: "#fff", fontWeight: "bold" }}>
        {!amount ? "..." : amount}
      </Text>
    </Box>
  );
}
