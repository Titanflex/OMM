import React, { useState, useEffect, useRef } from "react";
import {
    Grid,
    Container,
} from "@material-ui/core";

import MemeView from "./MemeView";
import Searchbar from "./Searchbar";

function MemeScrollList() {

    const [memes, setMemes] = useState([{ url: null }]);

    async function loadMeme() {
        const res = await fetch("http://localhost:3030/memeIO/get-memes");
        const json = await res.json();
        setMemes(json.docs);
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

    const ListMemes = ({ listmemes }) => (
        <Grid container spacing={1}>
            {
                listmemes.map(meme => (
                    <MemeView memeInfo={meme} key={meme.id} />
                ))}
        </Grid>
    );

    useComponentWillMount(() => console.log("Runs only once before component mounts"));
    useComponentDidMount(() => console.log("didMount"));

    return (
        <Container className="memeScrollListContainer" >
            <Grid container spacing={3}>
                <Grid item xs></Grid>
                <Grid item xs={4}>
                    <Searchbar /></Grid>
                <Grid item xs></Grid>
            </Grid>
            <Grid container spacing={1}>
                <ListMemes listmemes={memes} />
            </Grid>
        </Container>
    );
}




export default MemeScrollList;