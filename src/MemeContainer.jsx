import "./css/Meme.css";

import React, { Component } from "react";
import meme from "./img/placeHolderMeme.jpg";
import Container from "react-bootstrap/Container";

export default class MemeContainer extends Component {
  render() {
    return (
      <Container class="memeContainer">
        <p class = "memeText upper">Upper Text</p>
        <img src={meme} alt="Meme"></img>
        <p class = "memeText lower">Lower Text</p>
      </Container>
    );
  }
}
