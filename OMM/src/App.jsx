import MemeCreator from "./components/MemeCreator/MemeCreator";
import NavBar from "./components/NavBar/NavBar";
import {useRoutes} from 'hookrouter';
import routes from './router'

import "./css/global_style.css";



function App() {
  const routeResult = useRoutes(routes);
  return routeResult;
}

export default App;
