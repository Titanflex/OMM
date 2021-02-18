import React, { useState, useEffect } from "react";
import {
    Grid,
    IconButton,
    Container,
    Typography,
    Button,
    Popover,
} from "@material-ui/core";

import {FacebookShareButton, TwitterShareButton, RedditShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, RedditIcon, WhatsappIcon} from "react-share";


import { ToggleButton } from '@material-ui/lab';


import { makeStyles } from "@material-ui/core";
import {
    ThumbUp,
    GetApp,
    Share,
    Mail,
    CloudDownload,
    ThumbDown,
} from "@material-ui/icons";
import Moment from 'moment';
import domtoimage from "dom-to-image";
import "./../../css/Overview/memeView.css";
import { triggerBase64Download } from 'react-base64-downloader';

const useStyles = makeStyles((theme) => ({

}));

const MemeView = params => {
    const [memeInfo, setMemeInfo] = useState(params.memeInfo);
    const [likes, setLikes] = useState(params.memeInfo.likes);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [renAnchorEl, setRenAnchorEl] = useState(null);

    const classes = useStyles();

  //Popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
};

const handlePopClose = () => {
    setAnchorEl(null);
}

    const popOpen = Boolean(anchorEl);
    const id = popOpen ? 'share-popover' : undefined;


      
const download = () => {
    domtoimage.toJpeg(document.getElementById("imageid")).then(function (jpeg) {
        let stringLength = jpeg.length - 'data:image/png;base64,'.length;
        triggerBase64Download(jpeg, 'my_downloaded_meme');
    }); 
}

const handleLikeClick = (event) => {
    if(liked){
        setLikes(likes-1);
    }else{
        setLikes(likes+1);
    }
    likeMeme();
    setLiked(!liked);
}


const handleDislikeClick = (event) => {
    if(disliked){
        setLikes(likes+1);

    }else{
        setLikes(likes-1);
    }
    dislikeMeme();
    setDisliked(!disliked);
}




async function likeMeme() {
    if (!liked){
        await fetch("http://localhost:3030/memeIO/dislike-meme", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: memeInfo._id,
        }),
    }).then((response) => {
        console.log("liked");
        }
    );
    } else{     
            await fetch("http://localhost:3030/memeIO/like-meme", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: memeInfo._id,
            }),
        }).then((response) => {
            
            }
        );
    }    
    
}

      

    async function dislikeMeme() {
        if (!disliked){
            await fetch("http://localhost:3030/memeIO/like-meme", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: memeInfo._id,
            }),
        }).then((response) => {
            console.log("disliked");
            }
        );
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
            }).then((response) => {
                
                }
            );
        }    
        
    }

    useEffect(() => {
        // action on update of movies
    }, [likes]);

    //TODO
    function shareMeme() {

    }

    const synth = window.speechSynthesis;

    useEffect(()=>{
        console.log(params.isAccessible);
        if(params.isAccessible){
            console.log(memeInfo.description);
            let captions ="";
            memeInfo.caption.forEach((item) =>
                captions += item,
            );
            const text = new SpeechSynthesisUtterance(
                "The meme " + memeInfo.title + " shows " + memeInfo.description + ". The caption of the meme is " +
                memeInfo.caption[0]);
            text.voice = synth.getVoices()[3];
            synth.cancel();
            synth.speak(text)
        }
    }, [memeInfo]);




    return (
        <Container className="memeViewContainer">

            <Grid container spacing={2}>
                <Grid item xs >
                    {/*<Meme memeData={memeInfo} isAccessible={props.isAccessible}/>*/}
                    <img
                        id = {"imageid"}
                        src={memeInfo.url}
                        alt={"meme image"}
                        onClick={() => window.open(`/singleview/${memeInfo._id}`, "_self")}
                    />
                </Grid>
                <Grid container item xs direction="column" spacing={3}>

                    <Grid container item xl={4}>
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

                    <Grid container item xl={4}>
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
                            <Popover
                                id={id}
                                open={popOpen}
                                anchorEl={anchorEl}
                                onClose={handlePopClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                            >
                                <FacebookShareButton
                                    url={memeInfo.url}
                                    quote={"YoU cAN't cREatE GoOd mEMes wiTh An oNLiNE MEme cReAToR!!!!11!"}
                                    hashtag="#OMMeme"
                                    className={classes.socialMediaButton}>
                                    <FacebookIcon size={36} round/>
                                </FacebookShareButton>
                                <TwitterShareButton
                                    title={"OMMemes = Stonks"}
                                    url={memeInfo.url}
                                    hashtags={["OMMeme"]}
                                    className={classes.socialMediaButton}>
                                    <TwitterIcon size={36} round/>
                                </TwitterShareButton>
                                <RedditShareButton
                                    title={"OMMemes = Stonks"}
                                    url={memeInfo.url}
                                    className={classes.socialMediaButton}>
                                    <RedditIcon size={36} round/>
                                </RedditShareButton>
                                <WhatsappShareButton
                                    title={"OMMemes = Stonks"}
                                    url={memeInfo.url}
                                    separator={"\r\n"}
                                    className={classes.socialMediaButton}>
                                    <WhatsappIcon size={36} round/>
                                </WhatsappShareButton>
                            </Popover>
                        
                            <div>
                                <Button
                                className="classes.buttonStyle likeButton"
                                startIcon={<ThumbUp />}
                                variant="contained"
                                color="secondary"
                                onClick={handleLikeClick}
                            />
                            <Button
                                className="classes.buttonStyle likeButton"
                                startIcon={<ThumbDown />}
                                variant="contained"
                                color="secondary"
                                onClick={handleDislikeClick}

                            />
                            </div>

                        </div>
                    </Grid>
                </Grid>

            </Grid>

        </Container>
    );
}

export default MemeView;
