import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import IconButton from "@/components/ui/IconButton";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import TelegramIcon from "@material-ui/icons/Telegram";
import FacebookIcon from "@material-ui/icons/Facebook";
import CloudIcon from "@material-ui/icons/Cloud";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["shareAudio"])),
  },
});

function ShareAudio() {
  const { t } = useTranslation("shareAudio");

  return (
    <LayoutApp title={t("title")}>
      <FlexBox>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <div>
            <p>{t("description")}</p>
            <IconButton fontSizeIcon="large" icon="equalize" />
            <p style={{ marginTop: 50 }}>{t("textShare")}:</p>
            <div
              style={{
                display: "inline-grid",
                gridTemplateColumns: "auto auto",
                gridColumnGap: "50px",
                gridRowGap: "20px",
              }}
            >
              <FacebookIcon fontSize="large" />
              <TelegramIcon fontSize="large" />
              <WhatsAppIcon fontSize="large" />
              <CloudIcon fontSize="large" />
            </div>
          </div>
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default ShareAudio;
