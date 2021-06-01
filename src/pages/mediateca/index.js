import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import TabsMediateca from "component/statefull/TabsMediateca";
import IconButton from "component/ui/IconButton";
import SearchInput from "component/ui/SearchInput";
import useTranslation from "hooks/useTranslation";
import { useRouter } from "next/router";

function Mediateca(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "mediateca");

  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar title="Mediateca" />
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
              title={t?.myCloudTextButton}
              variantTitle="p"
              fontSizeIcon="1.8em"
              color="black"
              icon="CloudIcon"
            />
            <IconButton
              title={t?.mediaCloudTextButton}
              variantTitle="p"
              fontSizeIcon="1.8em"
              color="black"
              icon="CloudQueueIcon"
            />
          </div>
          <IconButton
            title="Mediateca"
            variantTitle="p"
            fontSizeIcon="1.8em"
            color="black"
            icon="LibraryMusicIcon"
            handleClick={() => router.push("/mediateca")}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <SearchInput placeholder={t?.textSearchInput} />
          <TabsMediateca
            title1={t?.textCategoryTab}
            title2={t?.textFavoriteTab}
          />
        </div>
      </FlexBox>
    </Container>
  );
}

export default Mediateca;
