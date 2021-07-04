import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CardContent, CardMedia, Card } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import Text from "component/ui/Text";
import { TextColorEnum, TextVariantEnum } from "enums";
import { uuid } from "uuidv4";

const useStyles = makeStyles({
  root: {
    maxWidth: 150,
  },
  media: {
    height: 140,
    maxWidth: 150,
  },
});

export default function RecentPublications() {
  const classes = useStyles();
  const { t } = useTranslation("home");

  return (
    <div style={{ marginBottom: 20, width: "100%" }}>
      <div style={{ marginTop: 15, marginBottom: 15, textAlign: "left" }}>
        <Text variant={TextVariantEnum.SUBTITLE2}>{t("recentPublicationsTitle")}</Text>
      </div>
      <div className="scrollingContainer">
        {/* eslint-disable-next-line no-unused-vars */}
        {[0, 1, 2].map((_item, _idx) => (
          <div key={uuid()} style={{ marginRight: 15 }}>
            <Card className={classes.root}>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                image="/images/radio_image.jpg"
                title="Contemplative Reptile"
                className={classes.media}
              />
              <CardContent style={{ whiteSpace: "normal" }}>
                <Text variant={TextVariantEnum.BODY2} color={TextColorEnum.TEXTSECONDARY}>
                  {t("recentPublicationsDescription")}
                </Text>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
