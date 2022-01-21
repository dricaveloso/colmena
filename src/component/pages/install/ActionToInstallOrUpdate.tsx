/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Text from "@/components/ui/Text";
import Box from "@material-ui/core/Box";
import { TextVariantEnum } from "@/enums/index";
import Button from "@material-ui/core/Button";
import theme from "@/styles/theme";
import SvgIcon from "@/components/ui/SvgIcon";
import Loading from "@/components/ui/Loading";
import BrowserDetected from "@/components/pages/install/BrowserDetected";
import BrowserCompabilities from "@/components/pages/install/BrowserCompabilities";

type Props = {
  appinstalled: boolean;
  canInstallprompt: boolean;
  enabledPwa: boolean;
  showInstallPrompt: () => void;
};

export default function ActionToInstallOrUpdate({
  appinstalled,
  canInstallprompt,
  enabledPwa,
  showInstallPrompt,
}: Props) {
  const { t } = useTranslation("install");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, [loading]);

  const messagePwaTitle = () => {
    if (!enabledPwa) return t("notCompatibleInstallationTitle");

    if (appinstalled || !canInstallprompt) return t("alreadyInstalledTitle");
    return t("compatibleInstallationTitle");
  };

  const buttonInstallPwa = () => {
    if (!enabledPwa) return null;

    if (appinstalled || !canInstallprompt) return null;
    return (
      <Button
        variant="contained"
        onClick={showInstallPrompt}
        style={{ backgroundColor: theme.palette.primary.light, color: "#fff", marginBottom: 30 }}
        startIcon={<SvgIcon icon="download" htmlColor="#fff" />}
      >
        {t("buttonInstall")}
      </Button>
    );
  };

  if (loading)
    return (
      <Box>
        <Loading />
      </Box>
    );

  return (
    <Box>
      <Text
        style={{ fontSize: 14, fontWeight: "bold", marginBottom: 30 }}
        variant={TextVariantEnum.H2}
      >
        {messagePwaTitle()}
      </Text>
      {buttonInstallPwa()}
      <BrowserDetected />
      {!enabledPwa && <BrowserCompabilities />}
    </Box>
  );
}
