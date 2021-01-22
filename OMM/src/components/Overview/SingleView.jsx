import React, { useState, useEffect, useRef } from "react";
import {
    Grid,
    Container,
    IconButton,

} from "@material-ui/core";

import ArrowRight from "@material-ui/icons/ChevronRight";
import ArrowLeft from "@material-ui/icons/ChevronLeft";

import MemeView from "./MemeView";
import NavBar from "../NavBar/NavBar";
import Searchbar from "./Searchbar";

function SingleView() {
    const [currentMeme, setCurrentMeme] = useState([{ lower: "", upper: "", url: "https://image.stern.de/7528150/t/sU/v3/w1440/r0/-/harold-hide-the-pain-meme-09.jpg" }]);
    const [memes, setMemes] = useState([{ lower: "hi", upper: "ho", url: "https://image.stern.de/7528150/t/sU/v3/w1440/r0/-/harold-hide-the-pain-meme-09.jpg" }]);
    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);

    // useEffect for componentDidMount
    // see: https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        const loadMemes = async () => {
            const res = await fetch("http://localhost:3030/memeIO/get-memes").then(res => {
                res.json().then(json => {
                    setMemes(json.docs);
                    setCurrentMeme(json.docs[0])
                    return json;

                })
            })
        };
        loadMemes();
    }, []);

    function nextMeme() {
        let current = currentMemeIndex;
        if (memes.length > 1) {
            current =
                currentMemeIndex === memes.length - 1 ? 0 : currentMemeIndex + 1;
            setCurrentMemeIndex(current);
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

    return (
        <div>
        <NavBar />
        <Container className="memeScrollListContainer" >
            <Grid container spacing={3}>
                <Grid item xs></Grid>
                <Grid item xs={4}>
                    <Searchbar /></Grid>
                <Grid item xs></Grid>
            </Grid>
            <Grid container spacing={6}>
                <Grid item xs={1} alignItems="center">
                    <IconButton className="arrows" onClick={previousMeme} aria-label="previous">
                        <ArrowLeft fontSize="large" />
                    </IconButton>
                </Grid>
                <Grid item xs alignItems="center">
                    <MemeView memeInfo={memes[currentMemeIndex]} />/
                </Grid>
                <Grid item xs={1} alignItems="center">
                    <IconButton className="arrows" onClick={nextMeme} aria-label="next">
                        <ArrowRight fontSize="large" />
                    </IconButton>
                </Grid>
            </Grid>
            </Container>
            </div>
    );
}


export default SingleView;