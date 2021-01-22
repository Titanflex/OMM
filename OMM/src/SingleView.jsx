import { useEffect } from "react";
import { useRedirect, navigate } from 'hookrouter';
import SingleViewComponent from "./components/Overview/SingleViewComponent";
import NavBar from "./components/NavBar/NavBar";

function SingleView() {

  return (
    <div>
      <NavBar />
      <SingleViewComponent />
    </div>
  );
}

export default SingleView;
