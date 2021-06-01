import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import IconButton from "component/ui/IconButton";
import useTranslation from "hooks/useTranslation";

function ShareAudio(props) {
  const { t } = useTranslation(props.lang, "shareAudio");

  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar title={t?.title} />
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
    </Container>
  );
}

export default ShareAudio;
