import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  FormControl,
  OutlinedInput,
  IconButton,
  InputLabel,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { navigate } from "hookrouter";

const useStyles = makeStyles((theme) => ({
    spacing: {
      marginBottom: theme.spacing(2),
    },
  }));


export default function SignIn() {
  const classes = useStyles();

  const [values, setValues] = useState({
    email: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const signIn = () => {
    navigate("/home");
    window.location.reload();
  };

  return (
    <div className="signing-container">
      <Typography className={classes.spacing} variant="h4">
        Sign In
      </Typography>
      <form>
        <TextField
          className={classes.spacing}
          id="email"
          label="E-Mail"
          placeholder=""
          helperText=""
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <FormControl className={classes.spacing} variant="outlined" fullWidth>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
        <Button className={classes.spacing} fullWidth variant="contained" color="primary" onClick={signIn}>
          Login
        </Button>
        <Button className={classes.spacing} fullWidth color="primary" >
         Reset Password
        </Button>
      </form>
    </div>
  );
}
