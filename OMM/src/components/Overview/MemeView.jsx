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

function MemeView() {

    const [upper, setUpper] = useState("hallo");
    const [lower, setLower] = useState("hi");
    const [memes, setMemes] = useState([{ url: "https://image.stern.de/7528150/t/sU/v3/w1440/r0/-/harold-hide-the-pain-meme-09.jpg" }]);
    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);

    function likeMeme() {

    }

    return (
        <Container className="memeViewContainer">

            <Grid container spacing={2}>
                <Grid item xs>
                    <ButtonBase id="memeDiv">
                        <Typography variant="body1"
                            className="memeText upper"
                            placeholder="Upper text"
                            value={upper}
                        />
                        <img className="memeImg" alt="complex" src={memes[currentMemeIndex].url} />
                        <Typography variant="body1"
                            className="memeText lower"
                            placeholder="Lower text"
                            value={lower}
                        />

                    </ButtonBase>
                </Grid>
                <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                        <div className="memeInfo">
                            <Typography gutterBottom variant="h6" id="meme-title">
                                MemeTitle
                        </Typography>
                            <Typography gutterBottom variant="body1">
                                Author: TabBle
                        </Typography>
                            <Typography variant="body2">
                                Created: 23.12.2020
                        </Typography>
                            <Typography variant="body2">
                                Likes: 234
                        </Typography>
                            <Typography variant="body2">
                                Comments: 47
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
