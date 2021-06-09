import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useRouter } from "next/router";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import useTranslation from "hooks/useTranslation";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    width: "60vw",
  },
  fullList: {
    width: "auto",
  },
}));

function AppBarSys({ title, back, lang, drawer = true }) {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();
  const { t } = useTranslation(lang, "drawer");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawerMenu = () => (
    <div
      role="presentation"
      onClick={() => setOpenDrawer(false)}
      onKeyDown={() => setOpenDrawer(false)}
      className={classes.list}
    >
      <List>
        <ListItem button key="1">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>MAIA</p>
            <small style={{ color: "gray" }}>version 1.0.0</small>
          </div>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="1" button onClick={() => router.push("/terms")}>
          <ListItemText primary={t?.termsOfUse} />
          <ListItemSecondaryAction>
            <ArrowForwardIosIcon fontSize="small" style={{ color: "gray" }} />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button key="2" onClick={() => router.push("/about")}>
          <ListItemText primary={t?.aboutMaia} />
          <ListItemSecondaryAction>
            <ArrowForwardIosIcon fontSize="small" style={{ color: "gray" }} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </div>
  );

  return (
    <AppBar position="static">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {drawer && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setOpenDrawer(!openDrawer)}
            >
              <MenuIcon />
            </IconButton>
          )}
          {back && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => router.back()}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
        </div>
        <SwipeableDrawer
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          {drawerMenu()}
        </SwipeableDrawer>
        <p
          onClick={() => router.push("/home")}
          style={{ fontSize: 14, fontWeight: "bold" }}
        >
          {title}
        </p>
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar alt="Remy Sharp" src="/avatar/3.jpg" />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default AppBarSys;
