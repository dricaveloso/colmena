import Box from "@material-ui/core/Box";
import SvgIcon from "@/components/ui/SvgIcon";
import Text from "@/components/ui/Text";
import { ButtonColorEnum, ButtonVariantEnum, TextVariantEnum } from "@/enums/*";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import Dialog from "@material-ui/core/Dialog";

type Props = {
  title?: string;
  message?: string;
  onClose: () => void;
  onOk: () => void;
};

export default function ActionConfirm({ title = "", message = "", onClose, onOk }: Props) {
  const { t: c } = useTranslation("common");

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} aria-labelledby="simple-dialog-title" open>
      <Box
        padding={2}
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <SvgIcon icon="warning" htmlColor="#FAAD14" style={{ fontSize: 58 }} />
        <Text variant={TextVariantEnum.H5} style={{ fontWeight: "bold" }}>
          {!title ? c("confirmTitleDelete") : title}
        </Text>
        <Text variant={TextVariantEnum.BODY1} style={{ textAlign: "center" }}>
          {!message ? c("confirmMessageDelete") : message}
        </Text>
        <Box
          display="flex"
          marginTop={3}
          justifyContent="center"
          flexDirection="row"
          flex={1}
          alignItems="center"
        >
          <Button
            handleClick={onClose}
            variant={ButtonVariantEnum.OUTLINED}
            color={ButtonColorEnum.SECONDARY}
            title={c("noTitle")}
            style={{ textTransform: "capitalize" }}
          />
          <Button
            handleClick={onOk}
            variant={ButtonVariantEnum.CONTAINED}
            color={ButtonColorEnum.PRIMARY}
            title={c("yesTitle")}
            style={{ textTransform: "capitalize", marginLeft: 5 }}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
