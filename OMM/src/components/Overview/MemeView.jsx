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

import { FacebookShareButton, TwitterShareButton, RedditShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, RedditIcon, WhatsappIcon } from "react-share";

import AuthService from "../../services/auth.service";
import { makeStyles } from "@material-ui/core";
import {
    ThumbUp,
    Mail,
    CloudDownload,
    ThumbDown,
} from "@material-ui/icons";
import Moment from 'moment';
import "./../../css/Overview/memeView.css";

const useStyles = makeStyles((theme) => ({
}));

const MemeView = props => {
    const [memeInfo, setMemeInfo] = useState(props.memeInfo);

    const [likes, setLikes] = useState(props.memeInfo.hasOwnProperty('listlikes')? props.memeInfo.listlikes : null);
    const [dislikes, setDislikes] = useState(props.memeInfo.hasOwnProperty('dislikes')? props.memeInfo.dislikes : null);

    const [liked, setLiked] = useState(likes ? likes.some(like => like.user === localStorage.user) : null);
    const [disliked, setDisliked] = useState(dislikes ? dislikes.some(dislike => dislike.user === localStorage.user) : null);
    const [anchorEl, setAnchorEl] = useState(null);

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


    async function download() {
        fetch("http://localhost:3030/memeIO/download-meme", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: memeInfo.title,
                url: memeInfo.url,
            }),
        }).then((res) => {
            return (res.json())
        }).then(json => {
                fetch("data:image/jpeg;base64," + json.data)
                    .then(res => res.blob())
                    .then(data => {
                        let a = document.createElement("a");
                        let url = window.URL.createObjectURL(data);
                        a.style = "display: none";
                        a.href = url;
                        a.download = memeInfo.title + ".jpeg";
                        a.click();
                    });
            }
        )
    };

    const handleLikeClick = (event) => {
        if (liked) {
            removelikeMeme();
        } else {
            if (disliked) {
                setDisliked(!disliked);
                removedislikeMeme();
            }
            likeMeme();
        }
        setLiked(!liked);
        props.getUpdatedMemes();
    }


    const handleDislikeClick = (event) => {
        if (disliked) {
            removedislikeMeme();
        } else {
            if (liked) {
                setLiked(!liked);
                removelikeMeme();
            }
            dislikeMeme();
        }
        setDisliked(!disliked);
        props.getUpdatedMemes();
    }




    async function likeMeme() {
        await fetch("http://localhost:3030/memeIO/like-meme", {
            method: "POST",
            mode: "cors",
            headers: AuthService.getTokenHeader(),
            body: JSON.stringify({
                id: memeInfo._id,
                date: Date.now(),
            }),
        }).then((response) => {
            console.log(response);
         
        });
    }

    async function removelikeMeme() {
        await fetch("http://localhost:3030/memeIO/remove-like-meme", {
            method: "POST",
            mode: "cors",
            headers: AuthService.getTokenHeader(),
            body: JSON.stringify({
                id: memeInfo._id
            }),
        }).then((response) => {
            console.log(response);
        });
    }


    async function dislikeMeme() {
        await fetch("http://localhost:3030/memeIO/dislike-meme", {
            method: "POST",
            mode: "cors",
            headers: AuthService.getTokenHeader(),
            body: JSON.stringify({
                id: memeInfo._id,
                date: Date.now,
            }),
        }).then((response) => {
            console.log("disliked");
        });
    }

    async function removedislikeMeme() {
        await fetch("http://localhost:3030/memeIO/remove-dislike-meme", {
            method: "POST",
            mode: "cors",
            headers: AuthService.getTokenHeader(),
            body: JSON.stringify({
                id: memeInfo._id
            }),
        }).then((response) => {
            console.log(response);
        });
    }

    const synth = window.speechSynthesis;

    useEffect(() => {
        if (props.isAccessible) {
            console.log(memeInfo.description);
            let captions = "";
            memeInfo.caption.forEach((item) =>
                captions += item,
            );
            const text = new SpeechSynthesisUtterance(
                "The meme " + memeInfo.title + " shows " + memeInfo.description + ". The caption of the meme is " +
                memeInfo.caption[0]);

            text.voice = synth.getVoices().filter(voice => {
                return voice.lang == 'en-US';
            })[0];

            synth.cancel();
            synth.speak(text)
        }
    }, [memeInfo]);



    return (
        <Container className="memeViewContainer">

            <Grid container spacing={2}>
                <Grid item xs >
                    <div className="imageDiv">
                        <img
                            id={"imageid"}
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
                                Author: {memeInfo.hasOwnProperty('author') ? memeInfo.author : "Anonymous"}
                            </Typography>
                            <Typography variant="body2">
                                Created: {memeInfo.hasOwnProperty('creationDate') ? Moment(memeInfo.creationDate).format('MMM Do YY') : "No date"}
                            </Typography>
                            <Typography variant="body2">
                                Votes: {(likes ? likes.length : 0) - (dislikes ? dislikes.length : 0)}
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs>
                        {memeInfo.publicOpt=="unlisted" ? 
                        <div>
                            <Typography variant="body2">
                                unlisted link:
                            </Typography>
                            <Typography variant="body2">
                               <Link href={memeInfo.url}>{memeInfo.url}</Link> 
                            </Typography>
                            </div>
                        :null}
                        
                  
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
                            {(memeInfo.publicOpt=="public" || memeInfo.publicOpt=="unlisted")  ? 
                            <div>
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
                                <TwitterShareButton
                                    title={"OMMemes = Stonks"}
                                    url={memeInfo.url}
                                    hashtags={["OMMeme"]}
                                    className={classes.socialMediaButton}>
                                    <TwitterIcon size={36} round />
                                </TwitterShareButton>
                                <RedditShareButton
                                    title={"OMMemes = Stonks"}
                                    url={memeInfo.url}
                                    className={classes.socialMediaButton}>
                                    <RedditIcon size={36} round />
                                </RedditShareButton>
                                <WhatsappShareButton
                                    title={"OMMemes = Stonks"}
                                    url={memeInfo.url}
                                    separator={"\r\n"}
                                    className={classes.socialMediaButton}>
                                    <WhatsappIcon size={36} round />
                                </WhatsappShareButton>
                            </Popover>
                        </div>

                        :null}
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
