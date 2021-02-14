import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import LeftSideComponent from "./LeftSideComponent";
import Grid from "@material-ui/core/Grid";
import { navigate } from "hookrouter";

import "./../../css/Login/login.css";

const useStyles = makeStyles((theme) => ({
  leftSide: {
    backgroundColor: theme.palette.primary.main,
    width: "40%",
  },
  gridItem: {
    width: "60%",
  },
}));

const LoginContainer = () => {
  const classes = useStyles();
  const [signIn, setSignIn] = useState(true);

  const handleChangeSigning = () => {
    setSignIn(!signIn);
  };


  useEffect(() => {
    //if there is a user already loged in, navigate back to home
    if (localStorage.user) {
      navigate("/");
    }
  });

  return (
    <Grid container spacing={0}>
      <Grid className={classes.leftSide} item s={1} >
        {signIn ? (
          <LeftSideComponent
            handleClick={handleChangeSigning}
            subtitle="You are new?"
            button="Sign Up"
          />
        ) : (
          <LeftSideComponent
            handleClick={handleChangeSigning}
            subtitle="Already have an account?"
            button="Sign In"
          />
        )}
      </Grid>
      <Grid className={classes.gridItem} item s={1} >
        {signIn ? <SignIn /> : <SignUp />}
      </Grid>
    </Grid>
  );
};

export default LoginContainer;
