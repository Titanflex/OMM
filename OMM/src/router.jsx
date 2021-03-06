import React from "react";
import Home from "./Home";
import Overview from "./components/MyOverview";
import SingleView from "./components/Overview/SingleView.jsx";
import LoginContainer from "./components/Login/LoginContainer";
import MyOverview from "./components/MyOverview/MyOverview";
import VideoGenerator from "./components/MemeCreator/VideoGenerator";

// all the routes and the corresponding components are defined here

const routes = {
  "/": () => <LoginContainer />,
  "/home": () => <Home />,
  "/overview": () => <Overview />,
  "/videoGen": () => <VideoGenerator />,
  "/my-memes": () => <MyOverview />,
  "/singleview:id": () => <SingleView />,
};

export default routes;