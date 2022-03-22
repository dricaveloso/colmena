/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Box from "@material-ui/core/Box";
import { TextVariantEnum } from "@/enums/*";
import ListSubheader from "@material-ui/core/ListSubheader";
import Text from "@/components/ui/Text";

type Props = {
  title: string;
  secondaryAction: React.ReactNode;
  children: React.ReactNode;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

export default function Section({ title, secondaryAction, children }: Props) {
  const classes = useStyles();
  return (
    <List
      subheader={
        <ListSubheader style={{ backgroundColor: "#F3F3F3" }}>
          <Box className="flex justify-between py-4">
            <Text
              variant={TextVariantEnum.BODY1}
              style={{ fontWeight: "bold", color: "#656469", textAlign: "left" }}
            >
              {title}
            </Text>
            <div>{secondaryAction}</div>
          </Box>
        </ListSubheader>
      }
      className={classes.root}
    >
      <ListItem>{children}</ListItem>
    </List>
  );
}
