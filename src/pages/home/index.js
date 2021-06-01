import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import useTranslation from "hooks/useTranslation";
import IconButton from "component/ui/IconButton";
import FooterApp from "component/layout/FooterApp";
import { useRouter } from "next/router";

function Home(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "home");

  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar title="MAIA" />
        <div>
          <h3>{t?.greeting} Maria</h3>
          <p>{t?.question}</p>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 20,
            }}
          >
            <IconButton
              title={t?.inviteText}
              variantTitle="p"
              icon="PersonAddIcon"
              fontSizeIcon="1.8em"
              handleClick={() => router.push("/invite")}
              color="black"
            />
            <IconButton
              title="Mediateca"
              variantTitle="p"
              icon="LibraryMusicIcon"
              fontSizeIcon="1.8em"
              handleClick={() => router.push("/mediateca")}
              color="black"
            />
          </div>
          <IconButton
            title={t?.record}
            variantTitle="p"
            icon="FiberManualRecordIcon"
            fontSizeIcon="2.1em"
            handleClick={() => router.push("/dashboard")}
            color="red"
          />
        </div>
        <FooterApp about={true} terms={true} lang={props.lang} />
      </FlexBox>
    </Container>
  );
}

export default Home;
