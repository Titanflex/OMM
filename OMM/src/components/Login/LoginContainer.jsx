import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import LeftSideComponent from "./LeftSideComponent";
import Grid from "@material-ui/core/Grid";

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
    if (localStorage.token) {
      navigate("/");
    }
  });

  return (
    <Grid container spacing={0}>
      <Grid className={classes.leftSide} item s={1} alignItems="center">
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
      <Grid className={classes.gridItem} item s={1} alignItems="center">
        {signIn ? <SignIn /> : <SignUp />}
      </Grid>
    </Grid>
  );
};

export default LoginContainer;
