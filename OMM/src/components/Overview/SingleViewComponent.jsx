import React, { useState, useEffect, useRef } from "react";
import {
    Grid,
    Container,
    IconButton,

} from "@material-ui/core";

import ArrowRight from "@material-ui/icons/ChevronRight";
import ArrowLeft from "@material-ui/icons/ChevronLeft";

import MemeView from "./MemeView";
import Searchbar from "./Searchbar";

function SingleViewComponent() {
    const [currentMeme, setCurrentMeme] = useState([{ lower: "", upper: "", url: "https://image.stern.de/7528150/t/sU/v3/w1440/r0/-/harold-hide-the-pain-meme-09.jpg" }]);
    const [memes, setMemes] = useState([{ lower: "hi", upper: "ho", url: "https://image.stern.de/7528150/t/sU/v3/w1440/r0/-/harold-hide-the-pain-meme-09.jpg" }]);
    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);

    async function loadMeme() {
        const res = await fetch("http://localhost:3030/memeIO/get-memes");
        const json = await res.json();
        setMemes(json.docs);
        setCurrentMemeIndex(0);
    }

    const useComponentWillMount = () => {
        const willMount = useRef(true);
        if (willMount.current) {
            loadMeme();
        }
        useComponentDidMount(() => {
            willMount.current = false;
        });
    };

    const useComponentDidMount = func => useEffect(func, []);

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

    

    useComponentWillMount(() => console.log("Runs only once before component mounts"));
    useComponentDidMount(() => console.log("didMount"));

    const CurrentMeme = ({ listmemes }) => (
        <Grid container spacing={1}>
            <MemeView memeInfo={listmemes[currentMemeIndex]} />
        </Grid>
    );

    return (

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
                    <CurrentMeme listmemes={memes} />
                </Grid>
                <Grid item xs={1} alignItems="center">
                    <IconButton className="arrows" onClick={nextMeme} aria-label="next">
                        <ArrowRight fontSize="large" />
                    </IconButton>
                </Grid>
            </Grid>
        </Container>
    );
}


export default SingleViewComponent;