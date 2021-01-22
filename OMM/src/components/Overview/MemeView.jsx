import React, { useState } from "react";
import {
    Grid,
    IconButton,
    Container,
    Typography,
    ButtonBase,
} from "@material-ui/core";

import {
    ThumbUp,
    GetApp,
    Share,
} from "@material-ui/icons";
import Moment from 'moment';
import { navigate } from "hookrouter";

import Meme from "./Meme";
import "./../../css/Overview/memeView.css";


const MemeView = props => {
    const [memeInfo, setMemeInfo] = useState(props.memeInfo);
    const [likes, setLikes] = useState(2);


    //TODO
    function likeMeme() {

    }
    //TODO
    function shareMeme() {

    }
    //TODO
    function downloadMeme() {

    }

    const handleClickShowMemeDetails = () => {
        navigate("/singleview");
        window.location.reload();
    };

    return (
        <Container className="memeViewContainer">

            <Grid container spacing={2}>
                <Grid item xs>
                    <Meme memeData={memeInfo} />
                </Grid>
                <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                        <div className="memeInfo">
                            <Typography gutterBottom variant="h6" id="meme-title">
                                {memeInfo.hasOwnProperty('title') ? memeInfo.title : "No Title"}
                            </Typography>
                            <Typography gutterBottom variant="body1">
                                Author: {memeInfo.hasOwnProperty('creator') ? memeInfo.creator : "Anonymous"}
                            </Typography>
                            <Typography variant="body2">
                                Created: {memeInfo.hasOwnProperty('creationDate') ? Moment(memeInfo.creationDate).format('MMM Do YY') : "No date"}
                            </Typography>
                            <Typography variant="body2">
                                Likes: {likes}
                            </Typography>

                        </div>
                    </Grid>
                    <Grid>
                        <div className="rateMemeButtons">
                            <IconButton onClick={likeMeme} aria-label="Like">
                                <ThumbUp fontSize="default" />
                            </IconButton>
                            <IconButton onClick={downloadMeme} aria-label="Like">
                                <GetApp fontSize="default" />
                            </IconButton>
                            <IconButton onClick={shareMeme} aria-label="Like">
                                <Share fontSize="default" />
                            </IconButton>
                        </div>
                    </Grid>

                </Grid>
            </Grid>
        </Container>
    );
}

export default MemeView;
