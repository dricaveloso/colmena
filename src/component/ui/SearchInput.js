import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
}));

export default function SearchInput({ placeholder }) {
  const classes = useStyles();

  return (
    <Paper component="form" elevation={1} className={classes.root}>
      <div>
        <InputBase className={classes.input} placeholder={placeholder} />
        <IconButton type="submit" aria-label="search">
          <SearchIcon />
        </IconButton>
      </div>
    </Paper>
  );
}
