import { useRoutes, navigate } from "hookrouter";
import LoginContainer from "./components/Authentication/LoginContainer";
import MemeCreator from "./components/MemeCreator/MemeCreator";
import MemeScrollList from "./components/Overview/MemeScrollList";
import NavBar from "./components/NavBar/NavBar";
import AuthService from "./services/auth.service";
import { useEffect, useState } from "react";

import "./css/global_style.css";

const routes = {
  "/login": () => <LoginContainer />,
  "/": () => <MemeCreator />,
  "/overview": () => <MemeScrollList />,
};


function App() {
  const routeResults = useRoutes(routes);
  const [logedIn, setLogedIn] = useState(false);

  useEffect(() => {
    //let user = AuthService.getUser();
    // check if there is user logged in and set loged in to true
    navigate("/login");
  }, []);

  return (
    <div style={{height: '100%'}}>
      {logedIn && <NavBar/>}
      {routeResults}
    </div>
  );
}

export default App;
