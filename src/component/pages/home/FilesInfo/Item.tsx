import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import theme from "@/styles/theme";

type Props = {
  title: string;
  color?: string;
  amount: number | undefined;
};

export default function Item({ title, amount, color = theme.palette.primary.main }: Props) {
  return (
    <Box data-testid="ui-file-info--item">
      <Text variant={TextVariantEnum.BODY2} style={{ color }}>
        {title}
      </Text>
      <Text variant={TextVariantEnum.H6} style={{ color, fontWeight: "bold" }}>
        {amount}
      </Text>
    </Box>
  );
}
