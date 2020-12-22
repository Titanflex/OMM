import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  header: {
    color: 'white'
  },
}));

const NavBar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
    <Toolbar>
      <Typography className={classes.header} variant="h6">
        MemeGenerator
      </Typography>
    </Toolbar>
  </AppBar>
  );
}

export default NavBar;