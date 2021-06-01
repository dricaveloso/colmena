import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import IconButton from "component/ui/IconButton";
import FooterApp from "component/layout/FooterApp";
import Divider from "component/ui/Divider";

function Profile() {
  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar title="Profile" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <IconButton
            title="Editar Perfil"
            icon="EditIcon"
            variantTitle="p"
            fontSizeIcon="1.8em"
          />
          <Divider marginBottom={20} />
          <IconButton
            title="Subir foto"
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
