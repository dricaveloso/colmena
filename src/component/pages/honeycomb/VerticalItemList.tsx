/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Box from "@material-ui/core/Box";
import { RoomItemInterface } from "@/interfaces/talk";
import IconButton from "@/components/ui/IconButton";
import { useRouter } from "next/router";
import theme from "@/styles/theme";
import { makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { getFirstLettersOfTwoFirstNames } from "@/utils/utils";
import Participants from "./Participants";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  description: {
    flexDirection: "column",
    flexGrow: 1,
    alignSelf: "stretch",
    overflow: "hidden",
    marginLeft: 5,
  },
  options: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
}));

type Props = {
  data: RoomItemInterface;
  backgroundColor: string;
};

const VerticalItemList = ({ data, backgroundColor }: Props) => {
  const classes = useStyles();
  const router = useRouter();
  const { id, displayName, token, canDeleteConversation, description } = data;

  return (
    <Box className={classes.card} style={{ backgroundColor }}>
      <ListItemAvatar>
        <Avatar>{getFirstLettersOfTwoFirstNames(displayName)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        data-testid="title"
        className={classes.description}
        primary={displayName}
        onClick={() =>
          router.push(`/honeycomb/${token}/${displayName}/${Number(canDeleteConversation)}`)
        }
        primaryTypographyProps={{ style: { color: theme.palette.primary.dark } }}
        secondary={
          <>
            <Participants token={token} />
            <span style={{ marginLeft: 3 }}>{description}</span>
          </>
        }
      />
      <Box className={classes.options}>
        <IconButton
          icon="more_vertical"
          color="#9A9A9A"
          style={{ padding: 0, margin: 0, minWidth: 30 }}
          fontSizeIcon="small"
        />
      </Box>
    </Box>
  );
};

export default VerticalItemList;
