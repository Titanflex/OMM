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
  makeStyles
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { navigate } from "hookrouter";
import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  spacing: {
    marginBottom: theme.spacing(2),
  },
}));


export default function SignUp() {
  const history = useHistory();
  const classes = useStyles();

  const [values, setValues] = useState({
    email: "",
    password: "",
    password2: "",
    weight: "",
    weightRange: "",
    showPassword: false,
    showPassword2: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowPassword2 = () => {
    setValues({ ...values, showPassword2: !values.showPassword2 });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const signUp = () => {
    navigate("/home", true);
    window.location.reload();
  };

  return (
    <div className="signing-container">
      <Typography className={classes.spacing} variant="h4">
        Sign Up
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
        <FormControl className={classes.spacing} variant="outlined" fullWidth>
          <InputLabel>Repeat Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword2 ? "text" : "password"}
            value={values.password2}
            onChange={handleChange("password2")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword2}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword2 ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={125}
          />
        </FormControl>
        <Button fullWidth variant="contained" color="primary" onClick={signUp}>
          Create Account
        </Button>
      </form>
    </div>
  );
}
