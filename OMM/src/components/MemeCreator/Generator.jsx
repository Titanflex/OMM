import React, {useState, useRef} from 'react';
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



import "./../../css/ImageSelection/imageSelection.css";
import domtoimage from "dom-to-image";

import {Menu, MenuItem, TextField} from "@material-ui/core";

import {FilePond, registerPlugin} from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "./../../css/MemeCreator/Generator.css";
import SpeechInputField from '../shared/SpeechInputField';


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
    const memeTitleRef = useRef();
    const [texts, setTexts] = useState([""]);
    const [title, setTitle] = useState("");
    const [quality, setQuality] = useState(100);

    const [titleError, setTitleError] = useState({
        show: false,
        text: "",
    });


    //PublicMenu
    const pubOptions = [
        'private',
        'public',
        'unlisted',
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
        'Local (for best results)',
        'Server-side (slightly different result) ',
        'Third-party (only for image flip templates)',
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

    //SizeMenu
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

    const handleTitleInput = (event) => {
        setTitle(event.target.value);
        setTitleError({
            show: false,
            text: "",
        });
    }

    const handleMissingTitle = () => {
        setTitleError({
            show: true,
            text: "Enter a meme title",
        });
    }

    const handleDuplicateTitle = () => {
        setTitleError({
            show: true,
            text: "Meme title already exists",
        });
    }



    //Local meme generation
    function createMemeLocally(quality = 1) {
        let meme = document.getElementById("memeContainer");
        //improve quality of meme by scaling an d set quality depending on selected file size
        let options = {
            width: meme.clientWidth * 4,
            height: meme.clientHeight * 4,
            style: {
                transform: 'scale(4)',
                transformOrigin: 'top left'
            },
            quality: quality,
        }

        domtoimage.toBlob(meme, options).then(function (jpeg) {
            //check if size is within limits
            let stringLength = jpeg.length - 'data:image/jpeg;base64,'.length;
            let sizeInKb = (4 * Math.ceil((stringLength / 3)) * 0.5624896334383812) / 1000;
            if ((selectedSizeIndex === 0 && sizeInKb > 200) || (selectedSizeIndex === 1 && sizeInKb > 600)) {
                //decrease quality if size is too large and rerender meme
                createMemeLocally(quality - 0.05);
            } else {
                let textArray = params.text.split(/\n/g);  //split text into lines
                setTexts(textArray);
                setGeneratedMeme(jpeg);
            }

        });
    }

    const objectToQueryParam = obj => {
        const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
        return "?" + params.join("&");
    };

    //Third-party meme generation
    async function createMemeOnImgFlip() {
        let textArray = params.text.split(/\n/g);  //split text into lines
        let missingLines = 10 - textArray.length;
        textArray.length = 10;
        textArray.fill("", 10 - missingLines, 10)
        setTexts(textArray);
        const par = {
            template_id: params.template.id,
            text0: `${textArray[0]}
                  ${textArray[1]}
                  ${textArray[2]}
                  ${textArray[3]}
                  ${textArray[4]}`,
            text1: `
                  ${textArray[5]}
                  ${textArray[6]}
                  ${textArray[7]}
                  ${textArray[8]}
                  ${textArray[9]}`,
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
        //check if created meme is too large and adapt quality
        if (selectedSizeIndex === 0 && data.size / 1000 > 200) {
            setQuality((200 / (data.size / 1000)) * 100);
        }
        if (selectedSizeIndex === 1 && data.size / 1000 > 600) {
            setQuality((200 / (data.size / 1000)) * 100);
        }

        //create base64 for download and upload
        let reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onloadend = function () {
            let base64data = reader.result;
            console.log(base64data);
            setGeneratedMeme(base64data);
            console.log(generatedMeme);
            setGeneratedMemeUrl(response);
        }
    }

    async function createMemeOnServer() {
        let textArray = params.text.split(/\n/g);  //split text into lines
        let imageUrl;
        let meme;
        if (params.isFreestyle) {
            meme = document.getElementById("freestyleCanvas");
            meme = document.getElementById("freestyleCanvas");
            let options = {
                quality: quality,
            }
            await domtoimage.toJpeg(meme, options).then(function (jpeg) {
                imageUrl = jpeg;
            })
        } else {
            imageUrl = params.template.url;
        }

        fetch("http://localhost:3030/memeIO/create-simple-meme", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                url: imageUrl,
                publicOpt: pubOptions[selectedPubIndex],
                author: localStorage.user,
                creationDate: Date.now(),
                upper: textArray,
                lower: "",
                fromGenerator: true,
                width: params.isFreestyle ? meme.clientWidth : null,
                height: params.isFreestyle ? meme.clientHeight : null,
                fileSize: selectedSizeIndex === 0 ? 200 : 600,

            }),
        }).then((res) => {
            return (res.json())
        }).then((data) => {
                setGeneratedMemeUrl(data.url);
            }
        );
    }


    async function generateMeme() {
        if (!title) {
            handleMissingTitle();
            return;
        }
        let isDuplicate;
        await fetch("http://localhost:3030/memeIO/get-memes").then(res => {
            res.json().then(json => {
                json.docs.forEach(meme => {
                    if(meme.title === title && !isDuplicate) {
                        handleDuplicateTitle();
                        isDuplicate = true;
                    }
                });
            }).then(() => {
                if (isDuplicate) return;
                if (selectedRenIndex === 0) { //local generation
                    createMemeLocally();
                }
                if (selectedRenIndex === 1) {
                    createMemeOnServer();
                }
                if (selectedRenIndex === 2) { //third-party generation with imgFlip API
                    createMemeOnImgFlip()
                }
            })
        });
    }

    async function handleDownload() {
        fetch("http://localhost:3030/memeIO/download-meme", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                url: generatedMemeUrl,
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
                        a.download = title + ".jpeg";
                        a.click();
                    });

            }
        )
    }


    return (
        <div>
            <Button
                className="classes.buttonStyle modal"
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
                <div style={modalStyle} className={classes.paper} >

                    <div style={{maxHeight: window.innerHeight-100, overflow:"auto"}}>
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
                            onChange={(event) => handleTitleInput(event)}
                        />
                        {/* <SpeechInputField ref={memeTitleRef} value={title} label="Meme Title" setValue={setTitle}/> */}
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
                                    disabled={(!params.template.id || params.isFreestyle) && (index === 2)}
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

                    <Button
                        className="classes.buttonStyle selection"
                        variant="contained"
                        onClick={generateMeme}
                        color="secondary"
                    >
                        Generate meme
                    </Button>
                    {generatedMeme && quality && <FilePond
                        files={[generatedMeme]}
                        allowImageResize={true}
                        allowFileEncode={true}
                        imageResizeTargetWidth={params.canvasWidth}
                        imageTransformOutputQuality={quality}
                        imageResizeTargetHeight={params.canvasHeight}
                        imageResizeMode={"cover"}
                        server={{
                            url: "http://localhost:3030/memeIO",
                            process: {
                                url: '/upload-Meme',
                                method: 'POST',
                                headers: {
                                    'author': localStorage.user,
                                    'title': title,
                                    'isPublic': isPublic,
                                    'publicOpt': pubOptions[selectedPubIndex],
                                    'type': 'meme',
                                    'upper': texts,
                                    'lower': "",
                                },
                                onload: (response) => {
                                    setGeneratedMemeUrl(response);
                                }
                            }
                        }}
                        name="file"
                    />}
                    {generatedMemeUrl && !generatedMeme && <img id={"preview"}
                                                                src={generatedMemeUrl}/>}
                    <div>
                        <div>
                            <Button
                                className="classes.buttonStyle selection"
                                startIcon={<CloudDownloadIcon/>}
                                variant="contained"
                                onClick={() => handleDownload()}
                                color="secondary"
                                disabled={!generatedMemeUrl}
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
                </div>
            </Modal>
        </div>
    );
}

export default Generator;
