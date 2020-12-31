import React, { useState } from "react";
import {
    Grid,
    Container,
} from "@material-ui/core";

import MemeView from "./MemeView";
import Searchbar from "./Searchbar";

function MemeScrollList() {

    const [memes, setMemes] = useState([{ url: "https://image.stern.de/7528150/t/sU/v3/w1440/r0/-/harold-hide-the-pain-meme-09.jpg" }]);
    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);


    async function loadMeme() {
        const res = await fetch("http://localhost:3030/memeIO/get-memes");
        const json = await res.json();
        setMemes(json.docs);
    }


    return (
        <Container className="memeScrollListContainer" >
            <Grid container spacing={3}>
                <Grid item xs></Grid>
                <Grid item xs={4}>
                    <Searchbar /></Grid>
                <Grid item xs></Grid>
            </Grid>
            <Grid container spacing={1}>
                <MemeView />
            </Grid>
            <Grid container spacing={1}>
                <MemeView />
            </Grid>
        </Container>
    );
}

export default MemeScrollList;