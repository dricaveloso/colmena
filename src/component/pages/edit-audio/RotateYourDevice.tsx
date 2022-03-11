import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import Image from "next/image";

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    backgroundColor: theme.palette.variation3.light,
    flex: 1,
    display: "flex",
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    color: theme.palette.variation6.main,
  },
}));

type Props = {
  title: string;
};

export default function RotateYourDevice({ title }: Props) {
  const classes = useStyles();
  return (
    <Box className={classes.bar}>
      <Text variant={TextVariantEnum.BODY2} className={classes.title}>
        {title}
      </Text>
      <Image src="/images/rotate_device.gif" width={40} height={40} />
    </Box>
  );
}
