import React, { useState, useEffect, useRef } from "react";
import {
    Grid,
    Button,
    Container,
    IconButton, Toolbar,
} from "@material-ui/core";
import { ToggleButton } from '@material-ui/lab';


import ArrowRight from "@material-ui/icons/ChevronRight";
import ArrowLeft from "@material-ui/icons/ChevronLeft";

import MemeView from "./MemeView";
import Searchbar from "./Searchbar";
import HearingIcon from "@material-ui/icons/Hearing";


function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        let id = setInterval(() => {
            savedCallback.current();
        }, delay);
        return () => clearInterval(id);
    }, [delay]);
}

function SingleView() {
    const [memes, setMemes] = useState([{ url: null }]);
    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRandom, setIsRandom] = useState(false);

    const [isAccessible, setIsAccessible] = useState(false);

    const handleFocus = () => {
        let text= isAccessible?"Stop text to speech":"Start text to speech"
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));

    };



    function randomize() {
        let randomIndex = Math.floor(Math.random() * memes.length);
        if (randomIndex !== currentMemeIndex) {
            setCurrentMemeIndex(randomIndex);
        } else {
            randomize();
        }
    }

    async function nextMeme() {
        let current = currentMemeIndex;
        console.log(currentMemeIndex);
        if (memes.length > 1) {
            if (isRandom) {
                randomize();
            } else {
                current = currentMemeIndex === 0 ? memes.length - 1 : currentMemeIndex - 1;
                await setCurrentMemeIndex(current);
            }

        }
    }

    function previousMeme() {
        let current = currentMemeIndex;
        if (memes.length > 1) {
            current =
                currentMemeIndex === 0 ? memes.length - 1 : currentMemeIndex - 1;
            setCurrentMemeIndex(current);
        }
    }

    const SingleMeme = () => {
        return (
            <MemeView memeInfo={memes[currentMemeIndex]} isAccessible={isAccessible} />
        )
    };

    // useEffect for componentDidMount
    // see: https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        const loadMemes = async () => {
            await fetch("http://localhost:3030/memeIO/get-memes").then(res => {
                res.json().then(json => {
                    setMemes(json.docs);

                    const url = window.location.pathname;
                    const memeId = url.substring(url.lastIndexOf('/') + 1);
                    const curMeme = json.docs.find(element => element._id === memeId);
                    console.log(curMeme)
                    console.log(json.docs)
                    const ind = json.docs.indexOf(curMeme);


                    setCurrentMemeIndex(ind);
                    return json;
                });
            })
        };
        loadMemes();
    }, []);

    useInterval(() => {
        if (isPlaying) {
            let current = currentMemeIndex;
            console.log(currentMemeIndex);
            if (memes.length > 1) {
                if (isRandom) {
                    randomize();
                } else {
                    current = currentMemeIndex === 0 ? memes.length - 1 : currentMemeIndex - 1;
                    setCurrentMemeIndex(current);
                }
            }
        }
    }, 5000);



    return (
        <Container className="memeScrollListContainer" >
            <Grid container spacing={3}>
                <Grid item xs>
                    <ToggleButton
                        value="check"
                        selected={isPlaying}
                        onChange={() => {
                            setIsPlaying(!isPlaying);
                        }}
                    >                        Play                </ToggleButton>

                    <ToggleButton
                        value="check"
                        selected={isRandom}
                        onChange={() => {
                            setIsRandom(!isRandom);
                        }}
                    >                        Random                </ToggleButton>
                    <ToggleButton
                        value="check"
                        selected={isAccessible}
                        onFocus={() => {handleFocus()}}
                        onClick={() => setIsAccessible(isAccessible?false:true)}
                    > <HearingIcon />
                    </ToggleButton>
                </Grid>
                <Grid item xs={4}>
                    <Searchbar /></Grid>
                <Grid item xs></Grid>
            </Grid>
            <Grid container spacing={6}>
                <Grid item xs={1} >
                    <IconButton className="arrows" onClick={previousMeme} aria-label="previous">
                        <ArrowLeft fontSize="large" />
                    </IconButton>
                </Grid>
                <Grid item xs >

                    <SingleMeme listmemes={memes} />

                </Grid>
                <Grid item xs={1}>
                    <IconButton className="arrows" onClick={nextMeme} aria-label="next">
                        <ArrowRight fontSize="large" />
                    </IconButton>
                </Grid>
            </Grid>

        </Container >
    );
}


export default SingleView;