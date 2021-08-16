import React from "react";
import Button from "@material-ui/core/Button";
import MaterialIcon from "@/components/ui/MaterialIcon";
// import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";

type Props = {
  icon: string;
  title?: string;
};

function ResourceUnavailable({ icon, title = "" }: Props) {
  // const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <>
      <MaterialIcon icon={icon} style={{ fontSize: 120 }} />
      <Text
        variant={TextVariantEnum.BODY1}
        gutterBottom
        style={{
          marginBottom: 40,
          marginTop: 10,
          textAlign: "center",
          paddingLeft: 20,
          paddingRight: 20,
          fontSize: 16,
        }}
      >
        {title}
      </Text>
      <Button color="primary" variant="outlined" onClick={() => router.back()}>
        {/* {t("form.backButton")} */}
        Back
      </Button>
    </>
  );
}

export default ResourceUnavailable;
