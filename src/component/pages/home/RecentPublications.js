import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CardContent, CardMedia, Typography, Card } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import Text from "component/ui/Text";

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
        <Text>{t("recentPublicationsTitle")}</Text>
      </div>
      <div className="scrollingContainer">
        {[0, 1, 2].map((item, idx) => (
          <div key={idx} style={{ marginRight: 15 }}>
            <Card className={classes.root}>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                image="/images/radio_image.jpg"
                title="Contemplative Reptile"
                className={classes.media}
              />
              <CardContent style={{ whiteSpace: "normal" }}>
                <Typography variant="body2" color="textSecondary" component="p">
                  {t("recentPublicationsDescription")}
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
