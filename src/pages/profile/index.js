import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import IconButton from "component/ui/IconButton";
import FooterApp from "component/layout/FooterApp";
import Divider from "component/ui/Divider";
import useTranslation from "hooks/useTranslation";

function Profile(props) {
  const { t } = useTranslation(props.lang, "profile");

  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar title={t?.title} />
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
        <FooterApp about={true} terms={true} lang={props.lang} />
      </FlexBox>
    </Container>
  );
}

export default Profile;
