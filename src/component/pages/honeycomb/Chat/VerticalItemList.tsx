/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {
  ChatMessageItemInterface,
  ChatMessageItemMessageParameterInterface,
} from "@/interfaces/talk";
import { makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { getFirstLettersOfTwoFirstNames, getFormattedDistanceDateFromNow } from "@/utils/utils";
import theme from "@/styles/theme";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { TextVariantEnum, TextColorEnum } from "@/enums/*";
import { parseCookies, setCookie } from "nookies";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "nowrap",
    width: "100%",
    minHeight: 40,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  description: {
    flexDirection: "column",
    flexGrow: 1,
    alignSelf: "stretch",
    overflow: "hidden",
    marginLeft: 5,
  },
}));

type Props = {
  item: ChatMessageItemInterface;
  prevItem: ChatMessageItemInterface | null;
};

const VerticalItemList = ({ item, prevItem }: Props) => {
  const cookies = parseCookies();
  const lang = cookies.NEXT_LOCALE || "en";
  const classes = useStyles();
  const { message, timestamp, actorDisplayName, actorId, systemMessage, messageParameters } = item;

  function getAvatarComponent(actorDisplayName: string, justifyContent = "flex-start") {
    if (
      (prevItem && prevItem.actorId !== actorId && systemMessage === "") ||
      prevItem?.systemMessage !== ""
    )
      return (
        <ListItemAvatar style={{ width: 30, height: 30, display: "flex", justifyContent }}>
          <Avatar>{getFirstLettersOfTwoFirstNames(actorDisplayName)}</Avatar>
        </ListItemAvatar>
      );

    return (
      <ListItemAvatar style={{ width: 30, height: 30, display: "flex", justifyContent }}>
        <span></span>
      </ListItemAvatar>
    );
  }

  function getDistanceTimeComponent(timestamp: number) {
    return (
      <Text variant={TextVariantEnum.CAPTION} style={{ color: "#9A9A9A" }}>
        {getFormattedDistanceDateFromNow(timestamp, lang)}
      </Text>
    );
  }

  if (systemMessage === "")
    return (
      <Box className={classes.card}>
        {getAvatarComponent(actorDisplayName, "flex-start")}
        <ListItemText
          data-testid="title"
          className={classes.description}
          primary={
            <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
              {((prevItem && prevItem.actorId !== actorId) ||
                (prevItem && prevItem.actorId === actorId && prevItem.systemMessage !== "")) && (
                <Box marginRight={1}>{actorDisplayName}</Box>
              )}
              {getDistanceTimeComponent(timestamp)}
            </Box>
          }
          secondary={message}
          style={{ paddingTop: 0, marginTop: 0 }}
          primaryTypographyProps={{
            style: {
              fontSize: 14,
              fontWeight: "bold",
              color: theme.palette.primary.main,
            },
          }}
          secondaryTypographyProps={{ style: { fontSize: 14, color: "#858585" } }}
        />
      </Box>
    );

  function prepareInfoMessage(
    message: string,
    messageParameters: ChatMessageItemMessageParameterInterface | undefined,
  ) {
    const arr = message.split(" ");
    const messageArr: React.ReactNode[] = [];
    arr.forEach((item) => {
      if (item === "{user}" || item === "{actor}")
        messageArr.push(
          <Chip
            size="small"
            style={{ fontSize: 12 }}
            avatar={
              <Avatar>
                {getFirstLettersOfTwoFirstNames(
                  item === "{user}" ? messageParameters?.user?.name : messageParameters?.actor.name,
                )}
              </Avatar>
            }
            label={
              item === "{user}" ? messageParameters?.user?.name : messageParameters?.actor.name
            }
          />,
        );
      else
        messageArr.push(
          <span style={{ marginLeft: 2, marginRight: 2, fontSize: 12 }}>{item}</span>,
        );
    });

    return messageArr;
  }

  return (
    <Box
      display="flex"
      flex="1"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ marginTop: 6, marginBottom: 6, marginLeft: 10, marginRight: 10 }}
    >
      <Text
        variant={TextVariantEnum.CAPTION}
        style={{ wordBreak: "break-work" }}
        color={TextColorEnum.TEXTSECONDARY}
      >
        {prepareInfoMessage(message, messageParameters)}
      </Text>
      <Text variant={TextVariantEnum.CAPTION} color={TextColorEnum.TEXTSECONDARY}>
        {getFormattedDistanceDateFromNow(timestamp, lang)}
      </Text>
    </Box>
  );
};

export default VerticalItemList;
