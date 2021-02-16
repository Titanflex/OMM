import React from "react";
import {Grid, makeStyles} from "@material-ui/core";
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@material-ui/core";
import { navigate } from "hookrouter";
import AuthService from "../../services/auth.service";

import "./../../css/NavBar/navbar.css";
import {ToggleButton} from "@material-ui/lab";
import HearingIcon from '@material-ui/icons/Hearing';

const navLinks = [
  { title: "overview", path: "/overview" },
  { title: "generator", path: "/" },
];
const useStyles = makeStyles({
  navbarDisplayFlex: {
    display: "flex",
    justifyContent: "space-between",
  },

  linkText: {
    textDecoration: "none",
    textTransform: "uppercase",
    color: "white",
  },

  button: {
    color: "white",
  },
});

const NavBar = () => {
  const classes = useStyles();

  const handleClick = (path) => {
    navigate(path);
  };



  const logout = () => {
    AuthService.logout();
    window.location.reload();
  };



  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">MemeGenerator</Typography>

        <List
          className={classes.navbarDisplayFlex}
          component="nav"
          aria-labelledby="main navigation"

        >
          {navLinks.map(({ title, path }) => (
            <ListItem
              key={title}
              className={classes.linkText}
              button
              onClick={(event) => handleClick(path)}
            >
              <ListItemText primary={title} />
            </ListItem>
          ))}
        </List>
        <div className="spacing"></div>
        <Button
          className={classes.button}
          color="inherit"
          onClick={(event) => logout()}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
