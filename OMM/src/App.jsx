import { useRoutes, navigate } from "hookrouter";
import LoginContainer from "./components/Login/LoginContainer";
import MemeCreator from "./components/MemeCreator/MemeCreator";
import MemeScrollList from "./components/Overview/MemeScrollList";
import SingleView from "./components/Overview/SingleView";
import NavBar from "./components/NavBar/NavBar";
import AuthService from "./services/auth.service";
import MyOverview from "./components/MyOverview/MyOverview";
import VideoGenerator from "./components/MemeCreator/VideoGenerator";
import { useEffect, useState } from "react";

import "./css/global_style.css";

const routes = {
  "/login": () => <LoginContainer />,
  "/": () => <MemeCreator />,
  "/overview": () => <MemeScrollList />,
  "/videoGen": () => <VideoGenerator />,
  "/singleview/:id": () => <SingleView />,
  "/my-memes": () => <MyOverview />
};

function App() {
  const routeResults = useRoutes(routes);

  const [loggedIn, setLoggedIn] = useState(false);
  //  console.log = console.warn = console.error = () => { };

  useEffect(() => {
    setLoggedIn(true);
    // check if there is a token
    if (localStorage.token) {
      AuthService.getUser().then((successful) => {
        if (successful) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
          navigate("/login");
        }
      });
    } else {
      //navigate to the login page if there is no user logged in
      setLoggedIn(false);
      navigate("/login");
    }
  }, []);

  return (

    <div style={{ height: '100%' }}>
      {loggedIn && <NavBar />}
      {routeResults}
    </div>
  );
}

export default App;
