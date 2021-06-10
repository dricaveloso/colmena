import React from "react";
import FlexBox from "component/ui/FlexBox";
import TabsMediateca from "component/statefull/TabsMediateca";
import IconButton from "component/ui/IconButton";
import useTranslation from "hooks/useTranslation";
import { useRouter } from "next/router";
import LayoutApp from "component/statefull/LayoutApp";
import SearchInput from "component/pages/mediateca/SearchInput";
import AudioList from "component/pages/mediateca/AudioList";
import { getAudios } from "services/audios";
import axios from "axios";

function Mediateca(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "mediateca");
  const { data } = getAudios();

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
          <AudioList data={data || props.data} />
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

export async function getStaticProps() {
  const response = await axios.get(
    "https://60c09a3db8d3670017555507.mockapi.io/api/v1/audios"
  );
  return {
    props: {
      data: response.data,
    },
  };
}

export default Mediateca;
