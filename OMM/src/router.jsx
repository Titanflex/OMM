import React from "react";
import Home from "./Home";
import Overview from "./Overview";
import SingleView from "./SingleView";
import LoginContainer from "./components/Login/LoginContainer";

// all the routes and the corresponding components are defined here

const routes = {
  "/": () => <LoginContainer />,
  "/home": () => <Home />,
  "/overview": () => <Overview />,
  "/singleview": () => <SingleView />,
};

export default routes;