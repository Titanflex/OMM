import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Container, AppBar, Toolbar, Typography, List, ListItem, ListItemText } from "@material-ui/core"
import { navigate } from "hookrouter";

const navLinks = [
  { title: 'overview', path: '/overview' },
  { title: 'generator', path: '/home' },
]
const useStyles = makeStyles({
  navbarDisplayFlex: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  linkText: {
    textDecoration: 'none',
    textTransform: 'uppercase',
    color: 'white'
  }
});



const NavBar = () => {
  const classes = useStyles();

  const handleClick = (path) => {
    navigate(path);
    window.location.reload();
  }

  return (
    <AppBar position="static">
      <Toolbar>

        <Typography variant="h6">
          MemeGenerator
      </Typography>

        <List
          className={classes.navbarDisplayFlex}
          component="nav"
          aria-labelledby="main navigation"

        >
          {navLinks.map(({ title, path }) => (
            <ListItem key={title} className={classes.linkText} button onClick={(event) => handleClick(path)}>
              <ListItemText primary={title} />
            </ListItem>

          ))}
        </List>
      </Toolbar>
    </AppBar >
  );
}

export default NavBar;
