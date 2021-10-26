/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import theme from "@/styles/theme";
import { makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { getFirstLettersOfTwoFirstNames } from "@/utils/utils";
import SvgIcon from "@/components/ui/SvgIcon";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    padding: 8,
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
  user: string;
  backgroundColor: string;
  selected?: boolean;
};

const UsersListItem = ({ user, backgroundColor, selected = false }: Props) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Box className={classes.card} style={{ backgroundColor }}>
      <ListItemAvatar>
        <Avatar>{getFirstLettersOfTwoFirstNames(user)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        data-testid="title"
        className={classes.description}
        primary={user}
        primaryTypographyProps={{ style: { color: theme.palette.primary.dark } }}
        // onClick={() => handleClick()}
      />
      <Box className={classes.options}>
        {selected && <SvgIcon icon="tick" htmlColor={theme.palette.secondary.main} />}
      </Box>
    </Box>
  );
};

export default UsersListItem;
