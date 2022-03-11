/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Box from "@material-ui/core/Box";
import { RoomItemInterface } from "@/interfaces/talk";
import { useRouter } from "next/router";
import theme from "@/styles/theme";
import { makeStyles } from "@material-ui/core";
import { getRandomInt } from "@/utils/utils";
import HoneycombAvatar from "@/components/pages/home/Section3/HoneycombList/Honeycomb";
import Chip from "@material-ui/core/Chip";
import { markChatAsRead } from "@/services/talk/chat";
import { useTranslation } from "next-i18next";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import ContextMenu from "@/components/pages/honeycomb/Chat/ContextMenu";
import { HoneycombContextOptions } from "@/enums/*";
import Clickable from "@/components/ui/Clickable";

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
    width: 65,
  },
  more: {
    padding: 0,
    margin: 0,
    minWidth: 30,
  },
}));

type Props = {
  data: RoomItemInterface;
};

const VerticalItemList = ({ data }: Props) => {
  const { t } = useTranslation("honeycomb");
  const [removeItem, setRemoveItem] = useState(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const classes = useStyles();
  const router = useRouter();
  const {
    id,
    displayName,
    token,
    canDeleteConversation,
    unreadMessages,
    lastMessage: { id: lastMessageId, actorId, actorDisplayName, message, messageParameters },
  } = data;

  const prepareTitleMessage = userRdx.user.id === actorId ? t("youTitle") : actorDisplayName;

  const prepareSubtitleMessage = () => {
    let msg = message || "";
    if (msg.indexOf("{actor}") !== -1) {
      msg = msg.replace("{actor}", messageParameters.actor.name);
    }
    if (msg.indexOf("{user}") !== -1) {
      const m = (messageParameters && messageParameters.user && messageParameters.user.name) || "";
      msg = msg.replace("{user}", m);
    }
    if (msg.indexOf("{file}") !== -1) {
      msg = msg.replace(
        "{file}",
        (messageParameters && messageParameters.file && messageParameters.file.name) || "",
      );
    }
    return msg;
  };

  const navigateTo = async () => {
    if (unreadMessages > 0) markChatAsRead(token, lastMessageId);
    router.push(`/honeycomb/${token}/${displayName}/${Number(canDeleteConversation)}`);
  };

  if (removeItem) return null;

  return (
    <Box className={classes.card}>
      <ListItemAvatar data-testid="honeycomb-avatar" className={classes.avatar}>
        <Clickable handleClick={navigateTo}>
          <HoneycombAvatar
            showTitle={false}
            width={55}
            height={47}
            image={`/images/honeycombs/honeycomb${getRandomInt(0, 13)}.png`}
          />
        </Clickable>
      </ListItemAvatar>
      <Clickable handleClick={navigateTo} className={classes.description}>
        <ListItemText
          data-testid="honeycomb-title"
          className={classes.description}
          primary={displayName}
          onClick={navigateTo}
          primaryTypographyProps={{
            style: {
              color: theme.palette.primary.dark,
              fontWeight: unreadMessages > 0 ? "bold" : "normal",
            },
          }}
          secondary={`${prepareTitleMessage}: ${prepareSubtitleMessage()}`}
          secondaryTypographyProps={{
            style: {
              fontWeight: unreadMessages > 0 ? "bold" : "normal",
            },
          }}
        />
      </Clickable>
      <Box className={classes.options}>
        {unreadMessages > 0 && <Chip label={unreadMessages} size="small" color="primary" />}
        <ContextMenu
          token={token}
          iconColor={theme.palette.gray.dark}
          blackList={[HoneycombContextOptions.ADD_PARTICIPANT]}
          handleFallbackLeaveConversation={() => setRemoveItem(true)}
        />
      </Box>
    </Box>
  );
};

export default VerticalItemList;
