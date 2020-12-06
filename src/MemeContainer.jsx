import "./css/Meme.css";

import React, { Component } from "react";
import meme from "./img/placeHolderMeme.jpg";
import Container from "react-bootstrap/Container";
import { Button } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';


window.addEventListener('DOMContentLoaded', function () {
    const backButton = document.getElementById('backButton');
    const nextButton = document.getElementById('nextButton');
    const moreImages = document.getElementById('loadFromServer');


    let memes = []
    let currentImageID = 1;
    let numberOfImages = () => memes.length;

    function renderImage(number) {
        let currentMeme = memes[number];
        let newImage = document.getElementById('meme');
        newImage.className = 'Meme';
        newImage.src = currentMeme.url;
        document.getElementById('memeDiv').innerHTML = '';
        document.getElementById('upper').innerHTML = '';
        document.getElementById('lower').innerHTML = '';
        document.getElementById('memeDiv').appendChild(newImage);
    }

    backButton.addEventListener('click', function () {
        if(numberOfImages() > 0){
            currentImageID = currentImageID === 0 ? numberOfImages() - 1 : currentImageID - 1;
            renderImage(currentImageID);
        }
    });
    nextButton.addEventListener('click', function () {
        if(numberOfImages() > 0){
            currentImageID = currentImageID === numberOfImages() - 1 ? 0 : currentImageID + 1;
            renderImage(currentImageID);
        }
    });
    moreImages.addEventListener('click', function(){
        loadImageUrls();
    })


    async function loadImageUrls() {
        await fetch('https://api.imgflip.com/get_memes', {
            method: 'GET',
        })
            .then(res => res.json())
            .then(json => memes = json.data.memes)
        console.log(memes)
        renderImage(1);
    }
});

export default class MemeContainer extends Component {
  render() {
    return (
      <Container >
          <div className='navigation'>
              <Button variant="outlined" color="primary"  id='loadFromServer'>Ich will mehr Memes!</Button>
          </div>
          <div className='navigation'>
              <Button variant="outlined" color="secondary" id="backButton">❮</Button>
              <Button variant="outlined" color="secondary" id="nextButton">❯</Button>
          </div>

          <div className ="memeContainer">
              <p className = "memeText upper" id='upper' >{this.props.caption1}</p>
              <div id='memeDiv'>
                  <img src={meme} id='meme'/>
              </div>
              <p className = "memeText lower" id='lower'>{this.props.caption2}</p>
          </div>
      </Container>


    );
  }
}
