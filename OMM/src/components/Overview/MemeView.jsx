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

import "./../../css/Overview/memeView.css";


const MemeView = props => {

    const [memeInfo, setMemeInfo] = useState(props.memeInfo);
    const [likes, setLikes] = useState(2);
    const [comments, setComments] = useState([{ comment: "jjkdfhkjh" }]);


    function likeMeme() {

    }

    return (
        <Container className="memeViewContainer">

            <Grid container spacing={2}>
                <Grid item xs>
                    <ButtonBase id="memeViewDiv">
                        <Typography variant="body1"
                            className="memeText upper"
                            placeholder="Upper text"
                            value={memeInfo.upper}
                        />
                        <img className="memeViewImg" alt="complex" src={memeInfo.url} />
                        <Typography variant="body1"
                            className="memeText lower"
                            placeholder="Lower text"
                            value={memeInfo.lower}
                        />

                    </ButtonBase>
                </Grid>
                <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                        <div className="memeInfo">
                            <Typography gutterBottom variant="h6" id="meme-title">
                                {memeInfo.lower}
                            </Typography>
                            <Typography gutterBottom variant="body1">
                                Author: OMMTutor1
                        </Typography>
                            <Typography variant="body2">
                                Created: 23.12.2020
                        </Typography>
                            <Typography variant="body2">
                                Likes: {likes}
                            </Typography>
                            <Typography variant="body2">
                                Comments: 7
                            </Typography>
                        </div>
                    </Grid>
                    <Grid>
                        <div className="rateMemeButtons">
                            <IconButton onClick={likeMeme} aria-label="Like">
                                <ThumbUp fontSize="default" />
                            </IconButton>
                            <IconButton onClick={likeMeme} aria-label="Like">
                                <GetApp fontSize="default" />
                            </IconButton>
                            <IconButton onClick={likeMeme} aria-label="Like">
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
