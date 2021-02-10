import { useRoutes, navigate } from "hookrouter";
import LoginContainer from "./components/Login/LoginContainer";
import MemeCreator from "./components/MemeCreator/MemeCreator";
import MemeScrollList from "./components/Overview/MemeScrollList";
import SingleView from "./components/Overview/SingleView";
import NavBar from "./components/NavBar/NavBar";
import AuthService from "./services/auth.service";
import { useEffect, useState } from "react";

import "./css/global_style.css";

const routes = {
  "/login": () => <LoginContainer />,
  "/": () => <MemeCreator />,
  "/overview": () => <MemeScrollList />,
  "/singleview/:id": () => <SingleView />,
};


function App() {
  const routeResults = useRoutes(routes);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // check if there is a token
    if(localStorage.generate) {
      setLoggedIn(true)
    }if (localStorage.token) {
      AuthService.getUser();
      //check if there is there is backend connection
      if (localStorage.user) {
        setLoggedIn(true);
      }
    } else {
      //navigate to the login page if there is no user logged in
      setLoggedIn(false);
      navigate("/login");
    }
  });

  return (
    <div style={{ height: '100%' }}>
      {loggedIn && <NavBar />}
      {routeResults}
    </div>
  );
}

export default App;
