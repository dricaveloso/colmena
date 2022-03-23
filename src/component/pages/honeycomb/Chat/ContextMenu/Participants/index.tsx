/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Participant from "./Participant";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { v4 as uuid } from "uuid";
import { useTranslation } from "next-i18next";
import InputAdornment from "@material-ui/core/InputAdornment";
import SvgIcon from "@/components/ui/SvgIcon";
import { RoomParticipant } from "@/interfaces/talk";
import ListSubheader from "@material-ui/core/ListSubheader";
import Box from "@material-ui/core/Box";
import { toast } from "@/utils/notifications";
import { useSelector } from "react-redux";
import { addParticipantToConversation } from "@/services/talk/room";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import Backdrop from "@/components/ui/Backdrop";
import UserListSkeleton from "@/components/ui/skeleton/UsersList";
// eslint-disable-next-line import/no-cycle
import { isModerator } from "@/components/pages/honeycomb/Chat/ContextMenu";

const useStyles = makeStyles((theme) => ({
  list: {
    textAlign: "left",
    alignItems: "stretch",
    marginTop: 5,
  },
  verticalList: {
    padding: 1,
  },
  subheaderTitle: {
    fontWeight: "bold",
    color: theme.palette.variation2.dark,
    paddingLeft: 0,
    fontSize: 15,
  },
  container: {
    flex: 1,
    display: "flex",
    padding: theme.spacing(2),
    flexDirection: "column",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 30,
  },
}));

type Props = {
  token: string;
  participantsIn: RoomParticipant[];
  participantsOut: string[];
  handleUpdateParticipants: () => void;
};

function Participants({ token, participantsOut, participantsIn, handleUpdateParticipants }: Props) {
  const classes = useStyles();
  const [participantsInArr, setParticipantsInArr] = useState<RoomParticipant[]>(participantsIn);
  const [participantsOutArr, setParticipantsOutArr] = useState(participantsOut);
  const [search, setSearch] = useState("");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const { t } = useTranslation("honeycomb");
  const { t: c } = useTranslation("common");

  useEffect(() => {
    if (search) {
      const partIn = participantsInArr.filter(
        (item) =>
          item.actorId.toString().indexOf(search) !== -1 ||
          item.displayName.toString().indexOf(search) !== -1,
      );
      const partOut = participantsOutArr.filter((item) => item.indexOf(search) !== -1);
      setParticipantsInArr(partIn);
      setParticipantsOutArr(partOut);
    } else {
      setParticipantsInArr(participantsIn);
      setParticipantsOutArr(participantsOut);
    }
  }, [search]);

  useEffect(() => {
    setParticipantsInArr(participantsIn);
    setParticipantsOutArr(participantsOut);
  }, [participantsIn, participantsOut]);

  const handleInviteParticipantIntern = (user: string, newUser: boolean) => {
    if (newUser) {
      setSearch("");
      handleInviteParticipant(user);
    }
  };

  async function handleInviteParticipant(user: string) {
    try {
      setShowBackdrop(true);
      setSearch("");
      await addParticipantToConversation(token, user);
      setParticipantsOutArr((participantsOut) => participantsOut.filter((item) => item !== user));
      setParticipantsInArr((participantsIn) => [
        ...participantsIn,
        ...[{ actorId: user, displayName: user, participantType: 3 }],
      ]);
      toast(t("contextMenuOptions.participantsAddedSuccessfully"), "success");
    } catch (e) {
      console.log(e);
      toast(c("genericErrorMessage"), "error");
    } finally {
      setShowBackdrop(false);
    }
  }

  const mountListItems = (items: string[], newUser = false, subheaderTitle = "") => (
    <List
      key={uuid()}
      className={classes.list}
      subheader={
        subheaderTitle ? (
          <ListSubheader className={classes.subheaderTitle} component="div">
            {subheaderTitle}
          </ListSubheader>
        ) : (
          <span></span>
        )
      }
    >
      {items.map((item: string, idx: number) => (
        <ListItem
          button
          onClick={() => handleInviteParticipantIntern(item, newUser)}
          key={uuid()}
          disableGutters
          className={classes.verticalList}
        >
          <Participant
            user={item}
            secondary={isModerator(participantsInArr, item) ? t("moderatorTitle") : ""}
            backgroundColor={idx % 2 === 0 ? "#fff" : "#F9F9F9"}
          />
        </ListItem>
      ))}
    </List>
  );

  const showUsersList = () => {
    const lists = [];

    if (!search) {
      const aux = participantsInArr.map((item) => item.actorId);
      lists.push(mountListItems(aux));
    } else {
      if (participantsInArr.length > 0) {
        const aux = participantsInArr.map((item) => item.actorId);
        lists.push(mountListItems(aux, false, t("membersTitle")));
      }
      if (participantsOutArr.length > 0) {
        lists.push(mountListItems(participantsOutArr, true, t("addParticipantsTitle")));
      }
    }

    return lists;
  };

  return (
    <Box className={classes.container}>
      <Backdrop open={showBackdrop} />
      <Text variant={TextVariantEnum.H5} className={classes.title}>
        {t("contextMenuOptions.addParticipantContextTitle")}
      </Text>
      <Box>
        <TextField
          label={c("honeycombModal.searchUserPlaceholder")}
          variant="outlined"
          onChange={(event) => setSearch(event.target.value)}
          value={search}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon icon="search" fontSize="small" htmlColor="#777777" />
              </InputAdornment>
            ),
          }}
          size="small"
        />
        {participantsInArr.length === 0 && !search ? (
          <UserListSkeleton />
        ) : (
          <Box style={{ height: "calc(100vh - 130px)", overflow: "scroll" }}>{showUsersList()}</Box>
        )}
      </Box>
    </Box>
  );
}

export default Participants;
