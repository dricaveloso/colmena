import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import TabsDashboard from "component/statefull/TabsDashboard";
import IconButton from "component/ui/IconButton";
import { useRouter } from "next/router";
import useTranslation from "hooks/useTranslation";

function Dashboard(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "dashboard");

  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar title="MAIA" />
        <IconButton
          title={t?.textRecordButton}
          variantTitle="h5"
          icon="AddCircleOutlineIcon"
          fontSizeIcon="2.3em"
          handleClick={() => router.push("/record")}
          color="black"
        />
        <TabsDashboard title1={t?.supportText} title2="Mediateca" />
      </FlexBox>
    </Container>
  );
}

export default Dashboard;
