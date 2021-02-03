import React, { useState, useEffect } from "react";
import {
    Grid,
    Container,
    IconButton,

} from "@material-ui/core";

import ArrowRight from "@material-ui/icons/ChevronRight";
import ArrowLeft from "@material-ui/icons/ChevronLeft";

import MemeView from "./MemeView";
import Searchbar from "./Searchbar";

function SingleView() {
    const [memes, setMemes] = useState([{ url: null }]);
    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);



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
        console.log(memes[currentMemeIndex])
        if (memes.length > 1) {
            current =
                currentMemeIndex === 0 ? memes.length - 1 : currentMemeIndex - 1;
            setCurrentMemeIndex(current);
        }
    }

    const SingleMeme = () => {
        return (
            <MemeView memeInfo={memes[currentMemeIndex]} />
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

    return (
        <Container className="memeScrollListContainer" >
            <Grid container spacing={3}>
                <Grid item xs></Grid>
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
                    <SingleMeme />
                </Grid>
                <Grid item xs={1}>
                    <IconButton className="arrows" onClick={nextMeme} aria-label="next">
                        <ArrowRight fontSize="large" />
                    </IconButton>
                </Grid>
            </Grid>
        </Container>
    );
}


export default SingleView;