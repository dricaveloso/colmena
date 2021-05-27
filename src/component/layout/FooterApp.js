import React from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import useTranslation from "hooks/useTranslation";

function FooterApp({ about = false, terms = true, fixed = false, lang }) {
  const { t } = useTranslation(lang, "common");
  const customStyle = fixed
    ? { position: "fixed", bottom: 0, marginBottom: 10 }
    : { display: "flex", flexDirection: "column" };

  const router = useRouter();

  return (
    <Box style={customStyle}>
      {about && (
        <Button
          size="small"
          variant="text"
          style={{ textTransform: "capitalize", color: "gray" }}
          onClick={() => router.push("/intro-1")}
        >
          {t?.termsOfUse}
        </Button>
      )}
      {terms && (
        <Button
          size="small"
          style={{ textTransform: "capitalize", color: "gray" }}
        >
          {t?.aboutMaia}
        </Button>
      )}
    </Box>
  );
}

export default FooterApp;
