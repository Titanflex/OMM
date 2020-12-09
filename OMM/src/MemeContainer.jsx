import "./css/Meme.css";

import React, { Component } from "react";
import meme from "./img/placeHolderMeme.jpg";
import Container from "react-bootstrap/Container";
import { Button } from '@material-ui/core';
import { NextPrevButton } from './components/NextPrevButton'


export default class MemeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMemeIndex: 0,
            numberOfImages: 1,
            memes: []
        }
    }

    nextMeme = () => {
        if (this.state.numberOfImages > 0) {
            this.setState({ currentMemeIndex: this.state.currentMemeIndex === 0 ? this.state.numberOfImages - 1 : this.state.currentMemeIndex - 1 })
        }
        console.log(this.props.caption1);
        this.props.changeHandler(this.state.memes[this.state.currentMemeIndex].upper, this.state.memes[this.state.currentMemeIndex].lower)
    };

    previousMeme = () => {
        if (this.state.numberOfImages > 0) {
            this.setState({ currentMemeIndex: this.state.currentMemeIndex === this.state.numberOfImages - 1 ? 0 : this.state.currentMemeIndex + 1 })
        }
        this.setState({ caption1: this.state.memes[this.state.currentMemeIndex].upper, caption2: this.state.memes[this.state.currentMemeIndex].lower })
        this.props.changeHandler(this.state.memes[this.state.currentMemeIndex].upper, this.state.memes[this.state.currentMemeIndex].lower)
    };

    getMoreMemes = async () => {
        const res = await fetch('https://api.imgflip.com/get_memes');
        const json = await res.json();
        this.setState({ numberOfImages: json.data.memes.length, memes: json.data.memes });
    };

    renderMeme = () => {
        if (this.state.numberOfImages <= 1) {
            return meme;
        } else {
            return this.state.memes[this.state.currentMemeIndex].url;
        }
    }

    loadMeme = async () => {
        const res = await fetch('http://localhost:3030/memeIO/get-memes');
        const json = await res.json();
        console.log(json)
        this.setState({ numberOfImages: json.memes.length, memes: json.memes, currentMemeIndex: 0 });
    }

    saveMeme = () => {
        fetch('http://localhost:3030/memeIO/save-meme', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: this.state.memes[this.state.currentMemeIndex].url,
                upper: this.props.caption1,
                lower: this.props.caption2
            })
        }).then(res => {
            this.loadMeme();
        })
        console.log('save');
    }

    render() {
        var currentMeme = this.renderMeme();
        return (
            <Container >
                <div className='navigation'>
                    <Button onClick={this.getMoreMemes} variant="outlined" color="primary">Ich will mehr Memes!</Button>
                </div>
                <div className='navigation'>
                    <NextPrevButton handleClick={this.previousMeme} variant="outlined" color="secondary">❮</NextPrevButton>
                    <NextPrevButton handleClick={this.nextMeme} variant="outlined" color="secondary">❯</NextPrevButton>
                </div>
                <div className='navigation'>
                    <Button onClick={this.loadMeme} variant="outlined" color="secondary">Load</Button>
                    <Button onClick={this.saveMeme} variant="outlined" color="secondary">Save</Button>
                </div>

                <div className="memeContainer">
                    <p className="memeText upper" id='upper' >{this.props.caption1}</p>
                    <div id='memeDiv'>
                        <img src={currentMeme} alt={this.meme} />
                    </div>
                    <p className="memeText lower" id='lower'>{this.props.caption2}</p>
                </div>
            </Container>
        );
    }
}
