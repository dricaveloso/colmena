import Box from "@material-ui/core/Box";
import SvgIcon from "@/components/ui/SvgIcon";
import Text from "@/components/ui/Text";
import { ButtonColorEnum, ButtonVariantEnum, TextVariantEnum } from "@/enums/*";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import Dialog from "@material-ui/core/Dialog";
import { AllIconProps } from "@/types/index";
import Divider from "@/components/ui/Divider";

type Props = {
  title?: string;
  icon?: AllIconProps;
  iconColor?: string;
  message?: string;
  onClose?: () => void;
  onOk?: () => void;
  isLoading?: boolean;
};

export default function ActionConfirm({
  title = "",
  icon = "warning",
  iconColor = "#FAAD14",
  message = "",
  onClose,
  onOk,
  isLoading = false,
}: Props) {
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
        <SvgIcon icon={icon} htmlColor={iconColor} style={{ fontSize: 58 }} />
        <Divider marginTop={22} />
        <Text variant={TextVariantEnum.H5} style={{ fontWeight: "bold", textAlign: "center" }}>
          {!title ? c("confirmTitleDelete") : title}
        </Text>
        <Divider marginTop={5} />
        <Text variant={TextVariantEnum.BODY1} style={{ textAlign: "center" }}>
          {!message ? c("confirmMessageDelete") : message}
        </Text>
        <Divider marginTop={6} />
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
            disabled={isLoading}
          />
          <Button
            handleClick={onOk}
            variant={ButtonVariantEnum.CONTAINED}
            color={ButtonColorEnum.PRIMARY}
            title={c("yesTitle")}
            style={{ textTransform: "capitalize", marginLeft: 5 }}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
