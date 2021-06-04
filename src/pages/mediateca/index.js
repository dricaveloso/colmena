import React from "react";
import FlexBox from "component/ui/FlexBox";
import TabsMediateca from "component/statefull/TabsMediateca";
import IconButton from "component/ui/IconButton";
import useTranslation from "hooks/useTranslation";
import { useRouter } from "next/router";
import LayoutApp from "component/statefull/LayoutApp";
import SearchInput from "component/pages/mediateca/SearchInput";
import AudioList from "component/pages/mediateca/AudioList";

function Mediateca(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "mediateca");

  return (
    <LayoutApp title="Mediateca" back={true}>
      <FlexBox justifyContent="space-between">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <IconButton
            title={t?.myCloudTextButton}
            variantTitle="p"
            fontSizeIcon="1.8em"
            color="black"
            icon="CloudIcon"
            handleClick={() => {}}
          />
          <IconButton
            title={t?.mediaCloudTextButton}
            variantTitle="p"
            fontSizeIcon="1.8em"
            color="black"
            icon="CloudQueueIcon"
            handleClick={() => {}}
          />
          <IconButton
            title="Mediateca"
            variantTitle="p"
            fontSizeIcon="1.8em"
            color="black"
            icon="LibraryMusicIcon"
            handleClick={() => router.push("/mediateca")}
          />
        </div>

        <SearchInput label={t?.textSearchInput} />

        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          <AudioList />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TabsMediateca
            title1={t?.textCategoryTab}
            title2={t?.textFavoriteTab}
          />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default Mediateca;
