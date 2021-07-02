import React from "react";
import FlexBox from "component/ui/FlexBox";
import TabsMediateca from "component/statefull/TabsMediateca";
import IconButton from "component/ui/IconButton";
import { useRouter } from "next/router";
import LayoutApp from "component/statefull/LayoutApp";
import SearchInput from "component/pages/mediateca/SearchInput";
import AudioList from "component/pages/mediateca/AudioList";
import { getAudios } from "services/audios";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import { JustifyContentEnum, TextVariantEnum } from "enums";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => {
  const response = await axios.get("https://60c09a3db8d3670017555507.mockapi.io/api/v1/audios");

  return {
    props: {
      ...(await serverSideTranslations(locale, ["mediateca", "drawer", "common"])),
      data: response.data,
    },
  };
};

function Mediateca(props: any) {
  const router = useRouter();
  const { t } = useTranslation("mediateca");

  const { data } = getAudios();

  const navigate = () => {
    router.push("/mediateca");
  };

  return (
    <LayoutApp title="Mediateca" back={true}>
      <FlexBox justifyContent={JustifyContentEnum.SPACEBETWEEN}>
        <div className="boxRowSpaceAround">
          <IconButton
            title={t("myCloudTextButton")}
            variantTitle={TextVariantEnum.BODY2}
            fontSizeIcon="1.8em"
            color="black"
            icon="cloud"
          />
          <IconButton
            title={t("mediaCloudTextButton")}
            variantTitle={TextVariantEnum.BODY2}
            fontSizeIcon="1.8em"
            color="black"
            icon="cloud_queue"
          />
          <IconButton
            title="Mediateca"
            variantTitle={TextVariantEnum.BODY2}
            fontSizeIcon="1.8em"
            color="black"
            icon="library_music"
            handleClick={navigate}
          />
        </div>

        <SearchInput label={t("textSearchInput")} />

        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-start",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <AudioList data={data || props.data} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <TabsMediateca title1={t("textCategoryTab")} title2={t("textFavoriteTab")} />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default Mediateca;
