import React, { useState, useEffect } from "react";
import {
    Grid,
    IconButton,
    Container,
    Typography,
    Button,
    Popover,
    Link,
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
    likeButton: {
        "&:hover": { backgroundColor: "yellow" },
        "&:focus": { backgroundColor: "yellow" }
      }
}));

const MemeView = props => {
    const [memeInfo, setMemeInfo] = useState(props.memeInfo);
    const [likes, setLikes] = useState(props.memeInfo.likes);
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
        dislikeMeme();
    }else{
        if(disliked){
            setDisliked(!disliked);
            setLikes(likes+2);
            likeMeme();
        }else{
            setLikes(likes+1);
        }
            likeMeme();
          
    }
    setLiked(!liked); 
    //props.loadMemesFunction();
}


const handleDislikeClick = (event) => {
    if(disliked){
        setLikes(likes+1);
        likeMeme();

    }else{
        if(liked){
            setLiked(!liked);
            setLikes(likes-2);
            dislikeMeme();
        } else {
            setLikes(likes-1);
        }
        dislikeMeme();
    }
    setDisliked(!disliked);
    //props.loadMemesFunction();
}




async function likeMeme() {
        await fetch("http://localhost:3030/memeIO/like-meme", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: memeInfo._id,
            user: localStorage.user,
            date: Date.now,
        }),
    }).then((response) => {
        console.log("liked");
        });  
}

      

    async function dislikeMeme() {
       
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
            console.log("disliked");
           
            });    
        
    }

    const synth = window.speechSynthesis;

    useEffect(()=>{
        if(props.isAccessible){
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
                    <div className="imageDiv">
                    {/*<Meme memeData={memeInfo} isAccessible={props.isAccessible}/>*/}
                    <img
                        id = {"imageid"}
                        src={memeInfo.url}
                        alt={"meme image"}
                        isAccessible={props.isAccessible}
                        onClick={() => window.open(`/singleview/${memeInfo._id}`, "_self")}
                    />
                    </div>
                </Grid>
                <Grid container xs direction="column" spacing={1}>

                    <Grid item xs>
                        <div className="memeInfo">
                            <Typography gutterBottom variant="h6" id="meme-title">
                            <Link href="#" onClick={() => window.open(`/singleview/${memeInfo._id}`, "_self")} color="inherit">
   
                            {memeInfo.hasOwnProperty('title') ? memeInfo.title : "No Title"}
  </Link>
                            </Typography>
                            <Typography gutterBottom variant="body1">
                                Author: {memeInfo.hasOwnProperty('creator') ? memeInfo.creator : "Anonymous"}
                            </Typography>
                            <Typography variant="body2">
                                Created: {memeInfo.hasOwnProperty('creationDate') ? Moment(memeInfo.creationDate).format('MMM Do YY') : "No date"}
                            </Typography>
                            <Typography variant="body2">
                                Votes: {likes}
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
                            </div>
                        </Grid>
                        <Grid item xs>
                            <div>
                                <IconButton
                                id="likeButton"
                                className="classes.buttonStyle selection classes.likeButton"
                                variant="contained"
                                color={(!liked) ? "secondary" : "primary"}
                                onClick={handleLikeClick}
                            >
                            <ThumbUp />
                            </IconButton>
                            <IconButton
                                id="dislikeButton"
                                className="classes.buttonStyle selection classes.likeButton"
                                startIcon={<ThumbDown />}
                                variant="contained"
                                color={(!disliked) ? "secondary" : "primary"}
                                onClick={handleDislikeClick}

                            >
                            <ThumbDown />
                            </IconButton>
                            </div>
                    </Grid>
                </Grid>

            </Grid>

        </Container>
    );
}

export default MemeView;
