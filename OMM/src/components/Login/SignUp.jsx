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

  /**
   * handles the change event of the textfield and sets the respective value to the state variable
   * @param {event}
   * @prop the label of the textfield where the change happened
   */
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

  /**
   * starting signing the user up if the ENTER key is pressed
   * @param {*} event
   */
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      signUp();
    }
  };

  /**
   * tries to signup the user
   * SUCCESSFUL: navigates to landing page
   * ERROR: shows error message
   */
  const signUp = () => {
    if (validate()) {
      AuthService.register(values.name, values.password).then((data) => {
        if (data.token) {
          //SUCCESSFUL Registration -> navigate to landing page
          navigate("/");
          window.location.reload();
        } else {
          if (data.msg) {
            setNameError({
              //username is already taken
              show: true,
              text: data.msg,
            });
          } else {
            setNameError({ show: true, text: "" });
            setPasswordError({ show: true, text: "" });
            setPasswordError2({
              show: true,
              text:
                "Something went wrong with signing you up, please try again!",
            });
          }
        }
      });
    }
  };

  /**
   * validates the user input
   * @return {boolean} true if the validation was succsessful / false if not
   */
  const validate = () => {
    //is the name empty?
    if (values.name === "") {
      setNameError({ show: true, text: "Please enter a name" });
      return false;
    }
    //is the password empty?
    if (values.password === "") {
      setPasswordError({ show: true, text: "Please enter a password" });
      return false;
    }
    //is the repeat password empty?
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
    //check password length -> needs at least 8 characters
    if (values.password.length < 8) {
      setPasswordError({ show: true, text: "" });
      setPasswordError2({
        show: true,
        text: "The password is too short. It must have at least 8 characters",
      });
      return false;
    }
    //validation was successful
    return true;
  };

  return (
    <div className="signing-container">
      <Typography className={classes.spacing} variant="h4">
        Create Account
      </Typography>
      <form>
        {/* NAME Textfield */}
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

        {/* PASSWORD textfield */}
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

        {/* REPEAT PASSWORD Textfield */}
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

        {/* SIGN UP BUTTON */}
        <Button fullWidth variant="contained" color="primary" onClick={signUp}>
          Sign Up
        </Button>
      </form>
    </div>
  );
}
