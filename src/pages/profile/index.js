import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import IconButton from "component/ui/IconButton";
import FooterApp from "component/layout/FooterApp";
import Divider from "component/ui/Divider";
import useTranslation from "hooks/useTranslation";
import LayoutApp from "component/statefull/LayoutApp";

function Profile(props) {
  const { t } = useTranslation(props.lang, "profile");

  return (
    <LayoutApp title={t?.title} back={true} drawer={false}>
      <FlexBox justifyContent="center">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <IconButton
            title={t?.textEditButton}
            icon="EditIcon"
            variantTitle="p"
            fontSizeIcon="1.8em"
          />
          <Divider marginBottom={20} />
          <IconButton
            title={t?.textPhotoButton}
            icon="PhotoCameraIcon"
            variantTitle="p"
            fontSizeIcon="1.8em"
          />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default Profile;
