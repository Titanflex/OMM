import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import MailIcon from '@material-ui/icons/Mail';
import ImageIcon from '@material-ui/icons/Image';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import {FacebookShareButton, TwitterShareButton, RedditShareButton, WhatsappShareButton} from "react-share";
import {FacebookIcon, TwitterIcon, RedditIcon, WhatsappIcon} from "react-share";
import {triggerBase64Download} from 'react-base64-downloader';


import "./../../css/ImageSelection/imageSelection.css";
import domtoimage from "dom-to-image";
import {Grid, Menu, MenuItem, TextField} from "@material-ui/core";

import {FilePond, registerPlugin} from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";



registerPlugin(FilePondPluginFileEncode, FilePondPluginImageResize, FilePondPluginImageTransform);


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
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState({
        show: false,
        text: "",
    });


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

    //RenderMenu
    const sizeOptions = [
        'small (max. 200KB)',
        'large (max. 600KB)',
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
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setGeneratedMemeUrl(null);
        setGeneratedMeme(null);
    };


    function domToImage(meme, quality = 1) {
        let options = {
            width: meme.clientWidth * 4,
            height: meme.clientHeight * 4,
            style: {
                transform: 'scale(4)',
                transformOrigin: 'top left'
            },
            quality: quality,
        }
        domtoimage.toJpeg(meme, options).then(function (jpeg) {
            let stringLength = jpeg.length - 'data:image/png;base64,'.length;
            let sizeInKb = (4 * Math.ceil((stringLength / 3)) * 0.5624896334383812) / 1000;
            if (selectedSizeIndex === 0 && sizeInKb > 200 || selectedSizeIndex === 1 && sizeInKb > 600) {
                domToImage(meme, quality - 0.05);
            } else {
                setGeneratedMeme(jpeg);
            }
        });
    }

    const objectToQueryParam = obj => {
        const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
        console.log(params.join("&"));
        return "?" + params.join("&");
    };

    async function generateMeme() {
        if(!title){
            setTitleError({
                show: true,
                text: "Enter a meme title",
            });
            return;
        }
        setTitleError({
            show: false,
            text: "",
        });
        if (selectedRenIndex === 0) { //local generation
            let meme = document.getElementById("memeContainer");
            domToImage(meme);
        }
        if (selectedRenIndex === 1) { ////TODO server side generation (phantomJS/JIMP)
            /*await fetch("http://localhost:3030/memeIO/generate", {
                  method: "POST",
                  mode: "cors",
                  headers: AuthService.getTokenHeader(),
                  body: JSON.stringify({
                      url: "http://localhost:3000",
                      author: localStorage.user,
                      title: title,
                  }),
              }).then((res) => {
                  return res.text();
              }).then((data) => {
                  console.log(data);
              });*/

        }
        if (selectedRenIndex === 2) { //third-party generation with imgFlip API
            let textArray = params.text.split(/\n/g);
            let texts = ["","","","","","","","","", ""];
            textArray.forEach(function (item, index) {
                texts[index] = item;
            })
            if (params.template.id) {
                const par = {
                    template_id: params.template.id,
                    text0: `${texts[0]}
                  ${texts[1]}
                  ${texts[2]}
                  ${texts[3]}
                  ${texts[4]}`,
                    text1: `
                  ${texts[5]}
                  ${texts[6]}
                  ${texts[7]}
                  ${texts[8]}
                  ${texts[9]}`,
                    username: "xzk03017",
                    password: "xzk03017@cndps.com",
                    font: 'impact',
                    max_font_size: params.fontSize,
                };
                const res = await fetch(
                    `https://api.imgflip.com/caption_image${objectToQueryParam(
                        par
                    )}`
                );
                const json = await res.json();
                let response = await fetch(json.data.url);
                let data = await response.blob();
                let metadata = {
                    type: 'image/jpeg'
                };
                let file = new File([data], title, metadata);
                setGeneratedMeme(file);
                setGeneratedMemeUrl(json.data.url);
            }
        }


    }


    return (
        <div>
            <Button
                className="classes.buttonStyle selection"
                startIcon={<ImageIcon/>}
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
                        {/* Text Field for Meme Title*/}
                        <TextField
                            error={titleError.show}
                            helperText={titleError.text}
                            className={classes.spacing}
                            id="name"
                            label="Meme Title (mandatory)"
                            placeholder=""
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                        <List component="nav" aria-label="Render settings">
                            <ListItem
                                button
                                aria-haspopup="true"
                                aria-controls="render-menu"
                                aria-label="render options"
                                onClick={handleRenListItem}
                            >
                                <ListItemText primary="Where to render?" secondary={renOptions[selectedRenIndex]}/>
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
                                    disabled={(!params.template.id || params.isFreestyle) && (index===2)}
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
                                <ListItemText primary="Who can see your Meme?"
                                              secondary={pubOptions[selectedPubIndex]}/>
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
                                <ListItemText primary="Size of the file?" secondary={sizeOptions[selectedSizeIndex]}/>
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
                            allowImageResize={true}
                            imageResizeTargetWidth={params.canvasWidth}
                            imageResizeTargetHeight={params.canvasHeight}
                            imageResizeMode={"cover"}
                            server={{
                                url: "http://localhost:3030/memeIO",
                                process: {
                                    url: '/upload',
                                    method: 'POST',
                                    headers: {
                                        'author': localStorage.user,
                                        'memeTitle': title,
                                        'isPublic': isPublic,
                                        'type': 'meme',
                                    },
                                    onload: (response) => {
                                        console.log(response);
                                        setGeneratedMemeUrl(response);
                                    }


                                }
                            }}
                            name="file"
                        />}
                    <div>
                        <div>
                            {/*   //TODO do not download Base64 but file from server */}
                            <Button
                                className="classes.buttonStyle selection"
                                startIcon={<CloudDownloadIcon/>}
                                variant="contained"
                                onClick={() => triggerBase64Download(generatedMeme, params.title)}
                                color="secondary"
                                disabled={!generatedMeme}
                            >
                                Download
                            </Button>
                            <Button
                                className="classes.buttonStyle selection"
                                startIcon={<MailIcon/>}
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
                                    <FacebookIcon size={36} round/>
                                </FacebookShareButton>
                                <TwitterShareButton
                                    title={"OMMemes = Stonks"}
                                    url={generatedMemeUrl}
                                    hashtags={["OMMeme"]}
                                    className={classes.socialMediaButton}>
                                    <TwitterIcon size={36} round/>
                                </TwitterShareButton>
                                <RedditShareButton
                                    title={"OMMemes = Stonks"}
                                    url={generatedMemeUrl}
                                    className={classes.socialMediaButton}>
                                    <RedditIcon size={36} round/>
                                </RedditShareButton>
                                <WhatsappShareButton
                                    title={"OMMemes = Stonks"}
                                    url={generatedMemeUrl}
                                    separator={"\r\n"}
                                    className={classes.socialMediaButton}>
                                    <WhatsappIcon size={36} round/>
                                </WhatsappShareButton>
                            </Popover>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Generator;
