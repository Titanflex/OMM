import { React, useState } from "react";
import { makeStyles } from "@material-ui/core";
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
import SpeechInput from "./SpeechInput";

const navLinks = [
  { title: "overview", path: "/overview" },
  { title: "good ol' meme generator", path: "/" },
  { title: "meme in motion generator", path: "/videoGen" },
  { title: "my memes", path: "/my-memes" },
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
    width: "fit-content",
    margin: 16,
  },

  button: {
    color: "white",
  },
});

/**
 * Contains navigation for the website.
 */
const NavBar = () => {
  const classes = useStyles();
  const [currentRoute, setCurrentRoute] = useState("/");

  /**
   * navigates to the given path
   * @param {string} path to the sub page
   */
  const handleClick = (path) => {
    setCurrentRoute(path);
    navigate(path);
  };

  /**
   * logs the user out
   */
  const logout = () => {
    AuthService.logout();
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" onClick={(event) => handleClick("/")}>
          Best Meme Generator
        </Typography>

        <List
          className={classes.navbarDisplayFlex}
          component="nav"
          aria-labelledby="main navigation"
        >
          {navLinks.map(({ title, path }) => (
            <ListItem
              selected={"/" + window.location.pathname.split("/")[1] === path}
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
        <Button className={classes.button} color="inherit" onClick={logout}>
          Logout
        </Button>
        <SpeechInput />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
