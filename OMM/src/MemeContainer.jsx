import "./css/Meme.css";

import React, { Component } from "react";
import meme from "./img/placeHolderMeme.jpg";
import Container from "react-bootstrap/Container";


export default class MemeContainer extends Component {


  render() {
    return (
      <Container class="memeContainer">
        <p class = "memeText upper" >{this.props.caption1}</p>
        <img src={meme} alt="Meme"></img>
        <p class = "memeText lower" >{this.props.caption2}</p>
      </Container>
    );
  }
}
