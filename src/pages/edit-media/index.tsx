import React from "react";
import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import Divider from "component/ui/Divider";
import LayoutApp from "component/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "profile",
        "drawer",
        "common",
      ])),
    },
  };
};

function EditMedia(props) {
  const { t } = useTranslation("profile");

  return (
    <LayoutApp title={t("title")} back={true} drawer={false}>
      <FlexBox justifyContent="center">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <IconButton
            title={t("textEditButton")}
            icon="edit"
            variantTitle="p"
            fontSizeIcon="1.8em"
          />
          <Divider marginBottom={20} />
          <IconButton
            title={t("textPhotoButton")}
            icon="photo_camera"
            variantTitle="p"
            fontSizeIcon="1.8em"
          />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default EditMedia;
