import {useEffect} from "react";
import {useRedirect, navigate} from 'hookrouter';
import MemeCreator from "./components/MemeCreator/MemeCreator";
import NavBar from "./components/NavBar/NavBar";

function Home() {

  return (
    <div>
      <NavBar />
      <MemeCreator />
    </div>
  );
}

export default Home;
