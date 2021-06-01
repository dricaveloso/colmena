import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import IconButton from "component/ui/IconButton";
import FooterApp from "component/layout/FooterApp";
import Divider from "component/ui/Divider";
import useTranslation from "hooks/useTranslation";
import { useRouter } from "next/router";

function RecordDone(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "recordDone");

  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar title={t?.title} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>{t?.description}</p>
          <Divider marginBottom={20} />
          <IconButton
            title={t?.textEditButton}
            icon="GraphicEqIcon"
            variantTitle="p"
            fontSizeIcon="1.8em"
            handleClick={() => router.push("/edit-audio")}
          />
          <Divider marginBottom={20} />
          <IconButton
            title={t?.textShareButton}
            icon="ShareIcon"
            variantTitle="p"
            fontSizeIcon="1.8em"
            handleClick={() => router.push("/share-audio")}
          />
        </div>
        <FooterApp about={true} terms={true} lang={props.lang} />
      </FlexBox>
    </Container>
  );
}

export default RecordDone;
