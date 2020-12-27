import React from "react";
import  { makeStyles } from "@material-ui/core"
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import "./../../css/Login/leftSideComponent.css";

const useStyles = makeStyles((theme) => ({
  spacing: {
    marginBottom: theme.spacing(3),
  },
}));

const LeftSideComponent = (props) => {
  const classes = useStyles();

  return (
    <div className="container">
      <Typography className={classes.spacing} variant="h3">
        Welcome to MemeCreator!
      </Typography>
      <Typography className={classes.spacing} variant="subtitle1">
        {props.subtitle}
      </Typography>
      <Button
        className={classes.spacing}
        onClick={props.handleClick}
        variant="contained"
        color="secondary"
      >
        {props.button}
      </Button>
    </div>
  );
};

export default LeftSideComponent;
