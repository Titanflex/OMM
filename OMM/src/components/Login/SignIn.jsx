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
  FormHelperText,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { navigate } from "hookrouter";
import AuthService from "../../services/auth.service";

const useStyles = makeStyles((theme) => ({
  spacing: {
    marginBottom: theme.spacing(2),
  },
}));

export default function SignIn() {
  const classes = useStyles();

  const [values, setValues] = useState({
    name: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const [nameError, setNameError] = useState({
    show: false,
    text: "",
  });
  const [passwordError, setPasswordError] = useState({
    show: false,
    text: "",
  });

  /**
   * handles the change event of the textfield and sets the respective value to the state variable
   * @param {event}
   * @prop the label of the textfield where the change happened
   */
  const handleChange = (prop) => (event) => {
    //name textfield changed
    if (prop === "name") {
      setNameError({ show: false, text: "" });
    }
    //password textfield changed
    if (prop === "password") {
      setPasswordError({ show: false, text: "" });
    }
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /**
   * starting signing the user in if the ENTER key is pressed
   * @param {*} event
   */
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      signIn();
    }
  };

  /**
   * tries to sign in the user with name and password
   * SUCCESSFUL: navigate to landing page
   * ERROR: show error message
   */
  const signIn = () => {
    console.log("Signing in...");
    if (validate()) {
      AuthService.login(values.name, values.password).then((data) => {
        if (data.token) {
          //SUCCESSFUL LOGIN -> navigate to landing page
          //window.location.reload();
          navigate("/");
        } else {
          if (data.msg) {
            setNameError({ show: true, text: "" });
            setPasswordError({ show: true, text: data.msg });
          } else {
            //something else went wrong the backend
            setNameError({ show: true, text: "" });
            setPasswordError({
              show: true,
              text: "Something went wrong with signing you in :(",
            });
          }
        }
      });
    }
  };

  /**
   * validates the user input
   * @return {boolean} true if the validation was successful / false if not
   */
  const validate = () => {
    //is the name emmpty?
    if (values.name === "") {
      setNameError({ show: true, text: "Please enter a name" });
      return false;
    }
    //is the password empty?
    if (values.password === "") {
      setPasswordError({ show: true, text: "Please enter a password" });
      return false;
    }
    //everything is fine ->
    return true;
  };

  return (
    <div className="signing-container">
      <Typography className={classes.spacing} variant="h4">
        Sign In
      </Typography>
      <form>
        <TextField
          error={nameError.show}
          helperText={nameError.text}
          className={classes.spacing}
          id="name"
          label="Name"
          placeholder=""
          value={values.name}
          fullWidth
          margin="normal"
          onChange={handleChange("name")}
          variant="outlined"
          onKeyPress={handleKeyPress}
        />
        <FormControl className={classes.spacing} variant="outlined" fullWidth>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? "text" : "password"}
            value={values.password}
            error={passwordError.show}
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
        <Button
          className={classes.spacing}
          id="login"
          fullWidth
          variant="contained"
          color="primary"
          onClick={signIn}
        >
          Login
        </Button>
      </form>
    </div>
  );
}
