import React from "react";
import Home from "./Home";
import Overview from "./Overview";
import SingleView from "./components/Overview/SingleView.jsx";
import LoginContainer from "./components/Login/LoginContainer";

// all the routes and the corresponding components are defined here

const routes = {
  "/": () => <LoginContainer />,
  "/home": () => <Home />,
  "/overview": () => <Overview />,
  "/singleview:id": () => <SingleView />,
};

export default routes;