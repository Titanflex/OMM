import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import MailIcon from '@material-ui/icons/Mail';
import ImageIcon from '@material-ui/icons/Image';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { FacebookShareButton, TwitterShareButton, RedditShareButton, WhatsappShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, RedditIcon, WhatsappIcon } from "react-share";
import { triggerBase64Download } from 'react-base64-downloader';


import "./../../css/ImageSelection/imageSelection.css";
import SaveIcon from "@material-ui/icons/Save";
import domtoimage from "dom-to-image";
import { Menu, MenuItem, TextField } from "@material-ui/core";


function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 564,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));




const Generator = params => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [generatedMeme, setGeneratedMeme] = useState(null)
    const [isLocal, setIsLocal] = useState(true);
    const [fileSize, setFileSize] = useState(400)
    const [isPublic, setIsPublic] = useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [renAnchorEl, setRenAnchorEl] = React.useState(null);
    const [selectedRenIndex, setSelectedRenIndex] = React.useState(1);
    const [pubAnchorEl, setPubAnchorEl] = React.useState(null);
    const [selectedPubIndex, setSelectedPubIndex] = React.useState(1);
    const [memeURL, setmemeURL] = "ToDo.com";

    //PublicMenu
    const pubOptions = [
        'Private',
        'Public',
        'Unlisted',
    ];

    const handlePubClose = () => {
        setPubAnchorEl(null);
    };

    const handlePubItemClick = (event, index) => {
        setSelectedPubIndex(index);
        setPubAnchorEl(null);
    };

    const handlePubListItem = (event) => {
        setPubAnchorEl(event.currentTarget);
    };

    //RenderMenu
    const renOptions = [
        'Local',
        'Server-side',
        'Third-party',
    ];

    const handleRenClose = () => {
        setRenAnchorEl(null);
    };

    const handleRenItemClick = (event, index) => {
        setSelectedRenIndex(index);
        setRenAnchorEl(null);
    };

    const handleRenListItem = (event) => {
        setRenAnchorEl(event.currentTarget);
    };

    //Popover
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopClose = () => {
        setAnchorEl(null);
    };

    const popOpen = Boolean(anchorEl);
    const id = popOpen ? 'share-popover' : undefined;

    //Modal
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleGeneration = (event) => {
        event.target.value === 'local' ? setIsLocal(true) : setIsLocal(false);
    }

    const handlePublicity = (event) => {
        event.target.value === 'public' ? setIsPublic(true) : setIsPublic(false);
    }

    function generateMeme() {
        let meme = document.getElementById("memeContainer");
        let options;
        if (params.isFreestyle) options = { width: params.canvasWidth, height: params.canvasHeight }
        domtoimage.toPng(meme, options).then(function (dataUrl) {
            setGeneratedMeme(dataUrl);
        }).catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
        if (!isLocal) { ////TODO server side generation
            fetch("http://localhost:3030/memeIO/save-meme", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: params.title,
                    url: generatedMeme,
                    creator: localStorage.user,
                    isPublic: isPublic,
                    creationDate: Date.now,
                }),
            }).then((res) => {
                handleClose();
            });
        }

    }


    return (
        <div>
            <Button
                className="classes.buttonStyle selection"
                startIcon={<ImageIcon />}
                variant="contained"
                onClick={handleOpen}
                color="secondary"
            >
                Create me(me)!
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <div style={modalStyle} className={classes.paper}>

                    <div>
                        <List component="nav" aria-label="Render settings">
                            <ListItem
                                button
                                aria-haspopup="true"
                                aria-controls="render-menu"
                                aria-label="render options"
                                onClick={handleRenListItem}
                            >
                                <ListItemText primary="Where to render?" secondary={renOptions[selectedRenIndex]} />
                            </ListItem>
                        </List>
                        <Menu
                            id="render-menu"
                            anchorEl={renAnchorEl}
                            keepMounted
                            open={Boolean(renAnchorEl)}
                            onClose={handleRenClose}>
                            {renOptions.map((option, index) => (
                                <MenuItem
                                    key={option}
                                    //disabled={index === 0}
                                    selected={index === selectedRenIndex}
                                    onClick={(event) => handleRenItemClick(event, index)}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                        <List component="nav" aria-label="Public settings">
                            <ListItem
                                button
                                aria-haspopup="true"
                                aria-controls="public-menu"
                                aria-label="public options"
                                onClick={handlePubListItem}
                            >
                                <ListItemText primary="Who can see your Meme?" secondary={pubOptions[selectedPubIndex]} />
                            </ListItem>
                        </List>
                        <Menu
                            id="render-menu"
                            anchorEl={pubAnchorEl}
                            keepMounted
                            open={Boolean(pubAnchorEl)}
                            onClose={handlePubClose}>
                            {pubOptions.map((option, index) => (
                                <MenuItem
                                    key={option}
                                    //disabled={index === 0}
                                    selected={index === selectedPubIndex}
                                    onClick={(event) => handlePubItemClick(event, index)}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                        <TextField
                            type={"number"}
                            className="textFieldTitleFormat"
                            id="standard-basic"
                            label="max. file size"
                            placeholder="File Size"
                            value={fileSize}
                            onChange={(event) => setFileSize(event.target.value)}
                        />
                    </div>
                    <Button
                        className="classes.buttonStyle selection"
                        variant="contained"
                        onClick={generateMeme}
                        color="secondary"
                    >
                        Generate meme
                    </Button>
                    {generatedMeme && (
                        <img
                            alt="Preview"
                            src={generatedMeme}
                        />
                    )}
                    <div>
                        <Button
                            className="classes.buttonStyle selection"
                            startIcon={<CloudDownloadIcon />}
                            variant="contained"
                            onClick={() => triggerBase64Download(generatedMeme, 'NiceMeme')}
                            color="secondary"
                            disabled={!generatedMeme}
                        >
                            Download
                    </Button>
                        <Button
                            className="classes.buttonStyle selection"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            //onClick={}
                            color="secondary"
                            disabled
                        >
                            Save
                    </Button>
                        <Button
                            className="classes.buttonStyle selection"
                            startIcon={<MailIcon />}
                            variant="contained"
                            color="secondary"
                            onClick={handleClick}
                            disabled={!generatedMeme}
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
                                url={memeURL}
                                quote={"YoU cAN't cREatE GoOd mEMes wiTh An oNLiNE MEme cReAToR!!!!11!"}
                                hashtag="#OMMeme"
                                className={classes.socialMediaButton}>
                                <FacebookIcon size={36} round />
                            </FacebookShareButton>
                            <TwitterShareButton
                                title={"OMMemes = Stonks"}
                                url={memeURL}
                                hashtags={["OMMeme"]}
                                className={classes.socialMediaButton}>
                                <TwitterIcon size={36} round />
                            </TwitterShareButton>
                            <RedditShareButton
                                title={"OMMemes = Stonks"}
                                url={memeURL}
                                className={classes.socialMediaButton}>
                                <RedditIcon size={36} round />
                            </RedditShareButton>
                            <WhatsappShareButton
                                title={"OMMemes = Stonks"}
                                url={memeURL}
                                separator={"\r\n"}
                                className={classes.socialMediaButton}>
                                <WhatsappIcon size={36} round />
                            </WhatsappShareButton>
                        </Popover>

                    </div>
                </div>
            </Modal >


        </div >
    );
}

export default Generator;
