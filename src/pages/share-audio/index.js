import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import IconButton from "component/ui/IconButton";
import useTranslation from "hooks/useTranslation";
import LayoutApp from "component/statefull/LayoutApp";

function ShareAudio(props) {
  const { t } = useTranslation(props.lang, "shareAudio");

  return (
    <LayoutApp title={t?.title} back={true}>
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
            <p>{t?.description}</p>
            <IconButton
              fontSizeIcon="1.7em"
              color="black"
              icon="GraphicEqIcon"
            />
            <p style={{ marginTop: 50 }}>{t?.textShare}:</p>
            <div
              style={{
                display: "inline-grid",
                gridTemplateColumns: "auto auto",
                gridColumnGap: "50px",
              }}
            >
              <IconButton
                fontSizeIcon="2em"
                color="black"
                icon="FacebookIcon"
              />
              <IconButton
                fontSizeIcon="2em"
                color="black"
                icon="TelegramIcon"
              />
              <IconButton
                fontSizeIcon="2em"
                color="black"
                icon="WhatsAppIcon"
              />
              <IconButton
                fontSizeIcon="2em"
                color="black"
                icon="CloudCircleIcon"
              />
            </div>
          </div>
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default ShareAudio;
