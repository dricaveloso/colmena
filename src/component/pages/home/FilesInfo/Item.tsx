import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";

type Props = {
  title: string;
  amount: number | undefined;
};

export default function Item({ title, amount }: Props) {
  return (
    <Box data-testid="ui-file-info--item">
      <Text variant={TextVariantEnum.BODY2} style={{ color: "#534bae" }}>
        {title}
      </Text>
      <Text variant={TextVariantEnum.H6} style={{ color: "#534bae", fontWeight: "bold" }}>
        {amount}
      </Text>
    </Box>
  );
}
