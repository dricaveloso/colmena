import React from "react";
import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import Divider from "component/ui/Divider";
import useTranslation from "hooks/useTranslation";
import LayoutApp from "component/statefull/LayoutApp";
import { useRouter } from "next/router";

function RecordDone(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "recordDone");

  return (
    <LayoutApp title={t?.title}>
      <FlexBox justifyContent="center">
        <p>{t?.description}</p>
        <Divider marginBottom={20} />
        <IconButton
          title={t?.textEditButton}
          icon="GraphicEqIcon"
          variantTitle="p"
          fontSizeIcon="1.8em"
          handleClick={() => router.push("/edit-audio")}
        />
        <Divider marginBottom={20} />
        <IconButton
          title={t?.textShareButton}
          icon="ShareIcon"
          variantTitle="p"
          fontSizeIcon="1.8em"
          handleClick={() => router.push("/share-audio")}
        />
      </FlexBox>
    </LayoutApp>
  );
}

export default RecordDone;
