import React from "react";
import FlexBox from "component/ui/FlexBox";
import useTranslation from "hooks/useTranslation";
import IconButton from "component/ui/IconButton";
import { useRouter } from "next/router";
import LayoutApp from "component/statefull/LayoutApp";

function Home(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "home");

  return (
    <LayoutApp title="MAIA" lang={props.lang}>
      <FlexBox justifyContent="space-around">
        <div>
          <h3>{t?.greeting} Makena</h3>
          <p>{t?.question}</p>
        </div>
        <div>
          <div
            style={{
              display: "inline-grid",
              gridTemplateColumns: "auto auto auto",
              gridColumnGap: "20px",
            }}
          >
            <IconButton
              title={t?.inviteText}
              variantTitle="p"
              icon="PersonAddIcon"
              fontSizeIcon="1.6em"
              handleClick={() => router.push("/invite")}
              color="black"
            />
            <IconButton
              title="Mediateca"
              variantTitle="p"
              icon="LibraryMusicIcon"
              fontSizeIcon="1.6em"
              handleClick={() => router.push("/mediateca")}
              color="black"
            />
            <IconButton
              title={t?.profileText}
              variantTitle="p"
              icon="EditIcon"
              fontSizeIcon="1.6em"
              handleClick={() => router.push("/profile")}
              color="black"
            />
          </div>
        </div>
        <IconButton
          title={t?.recordText}
          variantTitle="p"
          icon="FiberManualRecordIcon"
          fontSizeIcon="2.5em"
          handleClick={() => router.push("/record")}
          color="red"
        />
      </FlexBox>
    </LayoutApp>
  );
}

export default Home;
