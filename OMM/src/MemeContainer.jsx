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
            upper: "",
            lower: "",
            currentMemeIndex: 0,
            numberOfImages: 1,
            memes: []
        }
        this.handleChangeCaption1 = this.handleChangeCaption1.bind(this);
        this.handleChangeCaption2 = this.handleChangeCaption2.bind(this);
    }


    handleChangeCaption1(event) {
        this.setState({ upper: event.target.value });
    }

    handleChangeCaption2(event) {
        this.setState({ lower: event.target.value });
    }

    nextMeme = () => {
        let current = this.state.currentMemeIndex
        if (this.state.numberOfImages > 1) {
            current = this.state.currentMemeIndex === this.state.numberOfImages - 1 ? 0 : this.state.currentMemeIndex + 1
            this.setState({ currentMemeIndex: current, upper: this.state.memes[current].upper, lower: this.state.memes[current].lower })
        }
    };

    previousMeme = () => {
        let current = this.state.currentMemeIndex
        if (this.state.numberOfImages > 1) {
            current = this.state.currentMemeIndex === 0 ? this.state.numberOfImages - 1 : this.state.currentMemeIndex - 1
            this.setState({ currentMemeIndex: current, upper: this.state.memes[current].upper, lower: this.state.memes[current].lower })
        }
    };

    getMoreMemes = async () => {
        const res = await fetch('https://api.imgflip.com/get_memes');
        const json = await res.json();
        this.setState({ numberOfImages: json.data.memes.length, memes: json.data.memes, upper: '', lower: '' });
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
        this.setState({ numberOfImages: json.docs.length, memes: json.docs, currentMemeIndex: 0, upper: json.docs[0].upper, lower: json.docs[0].lower });
        
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
                upper: this.state.upper,
                lower: this.state.lower
            })
        }).then(res => {
            this.loadMeme();
        })
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
                    <textarea type="text" className="memeText upper" placeholder="Upper text"
                        value={this.state.upper} onChange={this.handleChangeCaption1} />
                    <div id='memeDiv'>
                        <img src={currentMeme} alt={this.meme} />
                    </div>
                    <textarea className="memeText lower" placeholder="Lower text"
                        value={this.state.lower} onChange={this.handleChangeCaption2} />

                </div>

            </Container>
        );
    }
}
