/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import UsersListItem from "./UsersListItem";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core";
// import EmptyInfo from "@/components/ui/EmptyInfo";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { v4 as uuid } from "uuid";

const useStyles = makeStyles(() => ({
  list: {
    textAlign: "left",
    alignItems: "stretch",
    height: 250,
  },
  verticalList: {
    padding: 1,
  },
}));

type Props = {
  users: string[];
  participants: string[];
  updateParticipants: (part: string[]) => void;
};

function UsersList({ users, participants, updateParticipants }: Props) {
  const classes = useStyles();
  const [usersComp, setUsersComp] = useState(users);
  const [usersSelected, setUsersSelected] = useState<string[]>(participants);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setUsersComp(search !== "" && participants.length > 0 ? participants : users);
  }, [users, participants, search]);

  useEffect(() => {
    if (search) {
      const regex = new RegExp(search, "ig");
      const aux = usersComp.filter((item) => regex.test(item));
      setUsersComp(aux);
    } else setUsersComp(users);
  }, [search]);

  // if (usersComp.length === 0) return <EmptyInfo description="Nenhum usuário encontrado" />;

  function selectUser(user: string) {
    const find = usersSelected.find((item) => item === user);
    if (!find) {
      setUsersSelected(usersSelected?.concat(user));
      updateParticipants(usersSelected?.concat(user));
    } else {
      const aux = usersSelected.filter((item) => item !== user);
      setUsersSelected(aux);
      updateParticipants(aux);
    }
    setSearch("");
  }

  return (
    <Box>
      <TextField
        label="Pesquisar um usuario"
        variant="outlined"
        onChange={(event) => setSearch(event.target.value)}
        value={search}
        size="small"
      />
      {usersSelected.length > 0 && (
        <Box
          display="flex"
          flex="1"
          flexDirection="row"
          flexWrap="wrap"
          style={{
            maxHeight: 70,
            overflow: "scroll",
            paddingBottom: 12,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          {usersSelected.reverse().map((item) => (
            <Chip
              key={uuid()}
              label={item}
              style={{ margin: 2 }}
              onDelete={() => selectUser(item)}
            />
          ))}
        </Box>
      )}
      <Box style={{ height: "50vh", overflow: "scroll" }}>
        <List className={classes.list}>
          {usersComp.length > 0 &&
            usersComp.map((item: string, idx: number) => (
              <ListItem
                button
                onClick={() => selectUser(item)}
                key={uuid()}
                disableGutters
                className={classes.verticalList}
              >
                <UsersListItem
                  selected={usersSelected.includes(item)}
                  user={item}
                  backgroundColor={idx % 2 === 0 ? "#fff" : "#F9F9F9"}
                />
              </ListItem>
            ))}
        </List>
      </Box>
    </Box>
  );
}

export default UsersList;
