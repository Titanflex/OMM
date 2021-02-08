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
  const [logedIn, setLogedIn] = useState(true);

  useEffect(() => {
    console.log("Hello")
    setLogedIn(true);
    // check if there is a token
    if (localStorage.token) {
      AuthService.getUser().then((successful) => {
        if (successful) {
          setLogedIn(true);
        } else {
          setLogedIn(false);
          navigate("/login");
        }
      });
    } else {
      setLogedIn(false);
      navigate("/login");
    }
  }, []);

  return (
    <div style={{ height: "100%" }}>
      {logedIn && <NavBar />}
      {routeResults}
    </div>
  );
}

export default App;
