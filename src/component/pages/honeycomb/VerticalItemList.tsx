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
import { getFirstLettersOfTwoFirstNames, getRandomInt } from "@/utils/utils";
import Participants from "./Participants";
import HoneycombAvatar from "@/components/pages/home/Section3/HoneycombList/Honeycomb";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    background: "#fff",
    padding: 8,
    borderRadius: 5,
    border: "1px solid #eee",
  },
  description: {
    flexDirection: "column",
    flexGrow: 1,
    alignSelf: "stretch",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginLeft: 5,
  },
  options: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  avatar: {
    display: "flex",
    alignItems: "center",
  },
}));

type Props = {
  data: RoomItemInterface;
  backgroundColor: string;
};

const VerticalItemList = ({ data, backgroundColor }: Props) => {
  const classes = useStyles();
  const router = useRouter();
  const { id, displayName, token, canDeleteConversation, description, unreadMessages } = data;

  const navigateTo = async () => {
    router.push(`/honeycomb/${token}/${displayName}/${Number(canDeleteConversation)}`);
  };

  return (
    <Box className={classes.card} style={{ backgroundColor }}>
      <ListItemAvatar className={classes.avatar}>
        <HoneycombAvatar
          showTitle={false}
          width={55}
          height={47}
          image={`/images/honeycombs/honeycomb${getRandomInt(0, 13)}.png`}
        />
      </ListItemAvatar>
      <ListItemText
        data-testid="title"
        className={classes.description}
        primary={displayName}
        onClick={navigateTo}
        primaryTypographyProps={{
          style: {
            color: theme.palette.primary.dark,
            fontWeight: unreadMessages > 0 ? "bold" : "normal",
          },
        }}
        secondary={
          <>
            <Participants token={token} />
            <span style={{ marginLeft: 3 }}>{description}</span>
          </>
        }
      />
      <Box className={classes.options}>
        {unreadMessages > 0 && <Chip label={unreadMessages} size="small" color="primary" />}
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
