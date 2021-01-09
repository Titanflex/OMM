import React from "react";
import Home from "./Home";
import Overview from "./Overview";
import LoginContainer from "./components/Authentication/LoginContainer";

// all the routes and the corresponding components are defined here

const routes = {
  "/": () => <LoginContainer />,
  "/home": () => <Home />,
  "/overview": () => <Overview />,
};

export default routes;