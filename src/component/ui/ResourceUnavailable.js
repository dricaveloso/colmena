import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MaterialIcon from "component/ui/MaterialIcon";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

function ResourceUnavailable({ icon, title }) {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <>
      <MaterialIcon icon={icon} style={{ fontSize: 120 }} />
      <Typography
        variant="p"
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
      </Typography>
      <Button color="primary" variant="outlined" onClick={() => router.back()}>
        {t("form.backButton")}
      </Button>
    </>
  );
}

export default ResourceUnavailable;
