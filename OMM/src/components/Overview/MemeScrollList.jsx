import React, { useState, useEffect, } from "react";
import {
    Grid,
    Container,
} from "@material-ui/core";

import MemeView from "./MemeView";
import Searchbar from "./Searchbar";


function MemeScrollList() {

    const [memes, setMemes] = useState([{ url: null }]);

    const ListMemes = ({ listmemes }) => {
        return (
            <Grid container spacing={1}>
                {
                    listmemes.map((meme) => (
                        <MemeView memeInfo={meme} key={meme.id} />
                    ))}
            </Grid>
        )
    };

    // useEffect for componentDidMount
    // see: https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        const loadMemes = async () => {
            const res = await fetch("http://localhost:3030/memeIO/get-memes").then(res => {
                res.json().then(json => {
                    setMemes(json.docs);

                    console.log(json.docs);
                    return json;

                })
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
            <Grid container spacing={1}>
                <ListMemes listmemes={memes} />
            </Grid>
        </Container>
    );
}


export default MemeScrollList;