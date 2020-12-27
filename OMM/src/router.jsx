import React from "react";
import Home from "./Home";
import LoginContainer from "./components/Login/LoginContainer";

// all the routes and the corresponding components are defined here

const routes = {
  "/": () => <LoginContainer />,
  "/home": () => <Home />,
};

export default routes;