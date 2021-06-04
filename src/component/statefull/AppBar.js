import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";
import { useRouter } from "next/router";

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
}));

function AppBarSys({ title, back, drawer = true }) {
  const classes = useStyles();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {drawer && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => {}}
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
            <Avatar alt="Remy Sharp" src="/avatar/1.jpg" />
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
