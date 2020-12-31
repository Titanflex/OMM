import { useEffect } from "react";
import { useRedirect, navigate } from 'hookrouter';
import MemeScrollList from "./components/Overview/MemeScrollList";
import NavBar from "./components/NavBar/NavBar";

function Overview() {

  return (
    <div>
      <NavBar />
      <MemeScrollList />
    </div>
  );
}

export default Overview;
