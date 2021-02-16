import React, { useState } from "react";
import {
    Grid,
    IconButton,
    Container,
    Typography,
    Button,
    Popover,
} from "@material-ui/core";



import { makeStyles } from "@material-ui/core";
import {
    ThumbUp,
    GetApp,
    Share,
    Mail,
    CloudDownload,
} from "@material-ui/icons";
import Moment from 'moment';
import domtoimage from "dom-to-image";
import Meme from "./Meme";
import "./../../css/Overview/memeView.css";
import { triggerBase64Download } from 'react-base64-downloader';
import SharePopover from "./SharePopover";

const useStyles = makeStyles((theme) => ({

}));

const MemeView = params => {
    const [memeInfo, setMemeInfo] = useState(params.memeInfo);
    const [liked, setLiked] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [renAnchorEl, setRenAnchorEl] = React.useState(null);

    const classes = useStyles();

  //Popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
};

const handlePopClose = () => {
    setAnchorEl(null);
};
  
      
const download = () => {
    domtoimage.toJpeg(document.getElementById("imageid")).then(function (jpeg) {
        let stringLength = jpeg.length - 'data:image/png;base64,'.length;
        triggerBase64Download(jpeg, 'my_downloaded_meme');
    }); 
}
    
      

    async function likeMeme() {
        if (!liked){
            await fetch("http://localhost:3030/memeIO/like-meme", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: memeInfo._id,
            }),
        }).then(response => setLiked(true));
        } else{     
                await fetch("http://localhost:3030/memeIO/dislike-meme", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: memeInfo._id,
                }),
            }).then(response => setLiked(false));
        }    
    }



    //TODO
    function shareMeme() {

    }



    return (
        <Container className="memeViewContainer">

            <Grid container spacing={2}>
                <Grid item xs >
                    {/*<Meme memeData={memeInfo} />*/}

                    <img
                        id = {"imageid"}
                        src={memeInfo.url}
                        alt={"meme image"}
                        onClick={() => window.open(`/singleview/${memeInfo._id}`, "_self")}
                    />


                </Grid>
                <Grid container item xs direction="column" spacing={2}>
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
                                Likes: {memeInfo.hasOwnProperty('likes') ? memeInfo.likes : "No likes"}
                            </Typography>

                        </div>
                    </Grid>
                    <Grid item xs>
                        <div className={classes.rateMemeButtons}>
                            <Button

                                className="classes.buttonStyle selection"
                                startIcon={<CloudDownload />}
                                variant="contained"
                                color="secondary"
                                disabled={!memeInfo}
                                onClick={download}
                            >
                                <i className="fa fa-download" />
                                Download
                            </Button>
                            <Button
                                className="classes.buttonStyle selection"
                                startIcon={<Mail />}
                                variant="contained"
                                color="secondary"
                                onClick={handleClick}
                                disabled={!memeInfo}
                            >
                                Share
                            </Button>
                            <SharePopover memeData={memeInfo} memeUrl={memeInfo.url} anchorEl={anchorEl} />
                            <Button
                                className="classes.buttonStyle selection"
                                startIcon={<ThumbUp />}
                                variant="contained"
                                color="secondary"
                                onClick={likeMeme}
                                disabled={!memeInfo}
                                selected={liked}
                            >
                                Like
                            </Button>
                        </div>
                    </Grid>
                </Grid>

            </Grid>

        </Container>
    );
}

export default MemeView;
