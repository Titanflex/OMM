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

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import AuthService from "../../services/auth.service";

registerPlugin(FilePondPluginFileEncode);


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
    const [generatedMeme, setGeneratedMeme] = useState(null);
    const [generatedMemeUrl, setGeneratedMemeUrl] = useState(null);
    const [isPublic, setIsPublic] = useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [renAnchorEl, setRenAnchorEl] = React.useState(null);
    const [selectedRenIndex, setSelectedRenIndex] = React.useState(1);
    const [pubAnchorEl, setPubAnchorEl] = React.useState(null);
    const [selectedPubIndex, setSelectedPubIndex] = React.useState(1);
    const [sizeAnchorEl, setSizeAnchorEl] = React.useState(null);
    const [selectedSizeIndex, setSelectedSizeIndex] = React.useState(1);


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

    //RenderMenu
    const sizeOptions = [
        'small (max. 100KB)',
        'medium (max. 200KB)',
        'big (max. 500KB)',
    ];

    const handleSizeClose = () => {
        setSizeAnchorEl(null);
    };

    const handleSizeItemClick = (event, index) => {
        setSelectedSizeIndex(index);
        setSizeAnchorEl(null);
    };

    const handleSizeListItem = (event) => {
        setSizeAnchorEl(event.currentTarget);
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
        if (params.title === "") {
            alert("Enter a meme title");
            return;
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setGeneratedMemeUrl(null);
        setGeneratedMeme(null);
    };



    async function generateMeme() {
        let meme = document.getElementById("memeContainer");
        if (selectedRenIndex === 0) {
            let options;
            if (params.isFreestyle) options = { width: params.canvasWidth, height: params.canvasHeight }
            domtoimage.toJpeg(meme, options).then(function (jpeg) {
                setGeneratedMeme(jpeg);
            });
        }
        if (selectedRenIndex === 1) { ////TODO server side generation (phantomJS?)
            await fetch("http://localhost:3030/memeIO/generate", {
                method: "POST",
                mode: "cors",
                headers: AuthService.getTokenHeader(),
                body: JSON.stringify({
                    url: "http://localhost:3000",
                    author: localStorage.user,
                    title: params.title,
                }),
            }).then((res) => {
                return res.text();
            }).then((data) => {
                console.log(data);
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
                        <List component="nav" aria-label="Size settings">
                            <ListItem
                                button
                                aria-haspopup="true"
                                aria-controls="public-menu"
                                aria-label="public options"
                                onClick={handleSizeListItem}
                            >
                                <ListItemText primary="Size of the file?" secondary={sizeOptions[selectedSizeIndex]} />
                            </ListItem>
                        </List>
                        <Menu
                            id="filesize-menu"
                            anchorEl={sizeAnchorEl}
                            keepMounted
                            open={Boolean(sizeAnchorEl)}
                            onClose={handleSizeClose}>
                            {sizeOptions.map((option, index) => (
                                <MenuItem
                                    key={option}
                                    //disabled={index === 0}
                                    selected={index === selectedSizeIndex}
                                    onClick={(event) => handleSizeItemClick(event, index)}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                    <Button
                        className="classes.buttonStyle selection"
                        variant="contained"
                        onClick={generateMeme}
                        color="secondary"
                    >
                        Generate meme
                    </Button>

                    {
                        generatedMeme && <FilePond
                            files={[generatedMeme]}
                            server={{
                                url: "http://localhost:3030/memeIO",
                                process: {
                                    url: '/upload',
                                    method: 'POST',
                                    headers: {
                                        'author': localStorage.user,
                                        'memeTitle': params.title,
                                        'isPublic': isPublic,
                                        'type': 'meme',

                                    },
                                    onload: (response) => {
                                        console.log(response);
                                        setGeneratedMemeUrl(response);
                                    }


                                }
                            }}
                            allowRevert="false"
                            name="file"
                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                        />}
                    {/*generatedMemeUrl && (
                    <img
                        alt="Preview"
                        src={generatedMemeUrl}
                    />
                )*/}
                    <div>
                        <div>
                            <Button
                                className="classes.buttonStyle selection"
                                startIcon={<CloudDownloadIcon />}
                                variant="contained"
                                onClick={() => triggerBase64Download(generatedMeme, params.title)}
                                color="secondary"
                                disabled={!generatedMeme}
                            >
                                Download
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
                                    url={generatedMemeUrl}
                                    quote={"YoU cAN't cREatE GoOd mEMes wiTh An oNLiNE MEme cReAToR!!!!11!"}
                                    hashtag="#OMMeme"
                                    className={classes.socialMediaButton}>
                                    <FacebookIcon size={36} round />
                                </FacebookShareButton>
                                <TwitterShareButton
                                    title={"OMMemes = Stonks"}
                                    url={generatedMemeUrl}
                                    hashtags={["OMMeme"]}
                                    className={classes.socialMediaButton}>
                                    <TwitterIcon size={36} round />
                                </TwitterShareButton>
                                <RedditShareButton
                                    title={"OMMemes = Stonks"}
                                    url={generatedMemeUrl}
                                    className={classes.socialMediaButton}>
                                    <RedditIcon size={36} round />
                                </RedditShareButton>
                                <WhatsappShareButton
                                    title={"OMMemes = Stonks"}
                                    url={generatedMemeUrl}
                                    separator={"\r\n"}
                                    className={classes.socialMediaButton}>
                                    <WhatsappIcon size={36} round />
                                </WhatsappShareButton>
                            </Popover>
                        </div>
                    </div>
                </div>
            </Modal >
        </div >
    );
}

export default Generator;
