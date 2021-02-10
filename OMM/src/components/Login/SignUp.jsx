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
  FormHelperText,
  makeStyles,
} from "@material-ui/core";
import { navigate } from "hookrouter";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AuthService from "../../services/auth.service";

const useStyles = makeStyles((theme) => ({
  spacing: {
    marginBottom: theme.spacing(2),
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const [values, setValues] = useState({
    name: "",
    password: "",
    password2: "",
    weight: "",
    weightRange: "",
    showPassword: false,
    showPassword2: false,
  });

  const [nameError, setNameError] = useState({
    show: false,
    text: "",
  });

  const [passwordError, setPasswordError] = useState({
    show: false,
    text: "",
  });

  const [passwordError2, setPasswordError2] = useState({
    show: false,
    text: "",
  });

  //handle input change and set error to false according to the texfield
  const handleChange = (prop) => (event) => {
    if (prop === "name") {
      setNameError({ show: false, text: "" });
    }
    if (prop === "password") {
      setPasswordError({ show: false, text: "" });
    }
    if (prop === "password2") {
      setPasswordError2({ show: false, text: "" });
    }
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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      signUp();
    }
  }

  const signUp = () => {
    if (validate()) {
      AuthService.register(values.name, values.password).then((data) => {
        if (data.token) {
          //Successful Registration
          navigate("/");
          window.location.reload();
        } else {
          if (data.msg) {
            //username is already taken
            setNameError({
              show: true,
              text: data.msg,
            });
          } else {
            setNameError({ show: true, text: "" });
            setPasswordError({ show: true, text: "" });
            setPasswordError2({
              show: true,
              text: "Something went wrong with signing you up :(",
            });
          }
        }
      });
    }
  };

  //validated the user input
  const validate = () => {
    //if name is empty?
    if (values.name === "") {
      setNameError({ show: true, text: "Please enter a name" });
      return false;
    }
    //if password is empty?
    if (values.password === "") {
      setPasswordError({ show: true, text: "Please enter a password" });
      return false;
    }
    //if password repeat is empty
    if (values.password2 === "") {
      setPasswordError2({ show: true, text: "Please enter a password" });
      return false;
    }
    //check is password and password repeat match
    if (values.password !== values.password2) {
      setPasswordError({ show: true, text: "" });
      setPasswordError2({ show: true, text: "The passwords do not match!" });
      return false;
    }
    //check password length
    if (values.password.length < 8) {
      setPasswordError({ show: true, text: "" });
      setPasswordError2({ show: true, text: "The password is too short. It must have at least 8 characters" });
      return false;
    }
    return true;
  };

  return (
    <div className="signing-container">
      <Typography className={classes.spacing} variant="h4">
        Create Account
      </Typography>
      <form>
        <TextField
          error={nameError.show}
          helperText={nameError.text}
          className={classes.spacing}
          id="name"
          label="Name"
          placeholder=""
          fullWidth
          margin="normal"
          variant="outlined"
          value={values.name}
          onChange={handleChange("name")}
          onKeyPress={handleKeyPress}
        />
        <FormControl className={classes.spacing} variant="outlined" fullWidth>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            error={passwordError.show}
            id="outlined-adornment-password"
            type={values.showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange("password")}
            onKeyPress={handleKeyPress}
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
          <FormHelperText error={passwordError.show}>
            {passwordError.text}
          </FormHelperText>
        </FormControl>
        <FormControl className={classes.spacing} variant="outlined" fullWidth>
          <InputLabel>Repeat Password</InputLabel>
          <OutlinedInput
            error={passwordError2.show}
            id="outlined-adornment-password"
            type={values.showPassword2 ? "text" : "password"}
            value={values.password2}
            onChange={handleChange("password2")}
            onKeyPress={handleKeyPress}
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
          <FormHelperText error={passwordError2.show}>
            {passwordError2.text}
          </FormHelperText>
        </FormControl>
        <Button fullWidth variant="contained" color="primary" onClick={signUp}>
          Sign Up
        </Button>
      </form>
    </div>
  );
}
