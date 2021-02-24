import React, {useState, useEffect} from "react";
import {
    Typography,
    Grid,
    Button,
    Container,
    TextField,
    FormControl,
    MenuItem,
    Select,
    makeStyles,
    IconButton,
    FormControlLabel,
} from "@material-ui/core";

import ArrowRight from "@material-ui/icons/ChevronRight";
import ArrowLeft from "@material-ui/icons/ChevronLeft";
import FormatColorTextIcon from '@material-ui/icons/FormatColorText';


import {
    FormatBold,
    FormatItalic,
} from "@material-ui/icons";


import {TwitterPicker} from 'react-color';


import ImageSelection from "../ImageSelection/ImageSelection";
import Generator from "../MemeCreator/Generator";


import "./../../css/MemeCreator/memeCreator.css";

import Checkbox from "@material-ui/core/Checkbox";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Tooltip from "@material-ui/core/Tooltip";
import SpeechInput from "./CaptionSpeechInput";

function MemeCreator() {


    const [upper, setUpper] = useState("");
    const [templates, setTemplates] = useState([
        {
            url:
                "https://image.stern.de/7528150/t/sU/v3/w1440/r0/-/harold-hide-the-pain-meme-09.jpg",
            name: "Hide the pain Harold",
        },
    ]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [color, setColor] = useState("white");
    const [fontSize, setFontSize] = useState("30");

    const [canvasWidth, setCanvasWidth] = useState(350);
    const [canvasHeight, setCanvasHeight] = useState(250);


    const [posUpperTop, setPosUpperTop] = useState(20);
    const [posUpperLeft, setPosUpperLeft] = useState(10);

    const [isFreestyle, setIsFreestyle] = useState(false);
    const [images, setImages] = useState([]);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const fontSizes = [
        10,
        12,
        14,
        16,
        18,
        20,
        22,
        24,
        26,
        28,
        30,
        32,
        34,
        36,
        38,
        40,
        42,
        46,
        48,
        50,
    ];

    const maxWidth = 600;
    const maxHeight = 1000;
    const minWidth = 200;
    const minHeight = 200;

    const useStyles = makeStyles((theme) => ({
        textFormat: {
            fontWeight: bold ? "bold" : "normal",
            fontStyle: italic ? "italic" : "normal",
            "-webkit-text-fill-color": color,
            fontSize: fontSize,
        },
        heading: {
            textAlign: 'left',
            margin: "16px",
        },
        upperText: {
            position: 'absolute',
            left: "0px",
            top: "0px",
            width: '100%',
            height: '100%',
            'max-width': maxWidth + 'px',
            'max-height': maxHeight + 'px',
            overflow: 'hidden',
        }, memeCanvas: {
            width: (isFreestyle) ? canvasWidth + "px" : '350px',
            'min-width': minWidth + 'px',
            'min-height': minHeight + 'px',
            'max-width': maxWidth + 'px',
            'max-height': maxHeight + 'px',
            height: (isFreestyle) ? (canvasHeight + "px") : 'auto',

        }, freestyleCanvas: {
            width: canvasWidth + "px",
            height: canvasHeight + "px",
            backgroundColor: "white",
            border: '1px solid grey',
        },
        memeImg: {
            width: '350px',
            height: 'auto',
            display: 'block',
        }, canvas: {
            width: (isFreestyle) ? canvasWidth + "px" : '350px',
            'min-width': minWidth + 'px',
            'min-height': minHeight + 'px',
            'max-width': maxWidth + 'px',
            'max-height': maxHeight + 'px',
            overflow: 'hidden',
        },
        buttonStyle: {
            height: 'fit-content',
        }
    }));

    const classes = useStyles();

    useEffect(() => {
        getTemplates();
    }, []);

    async function getTemplates() {
        const res = await fetch("http://localhost:3030/memeIO/get-templates");
        const json = await res.json();
        if (json.docs.length > 0) {
            setTemplates(json.docs);
        }
    }

    function nextMeme() {
        let current = currentTemplateIndex;
        if (templates.length > 1) {
            current =
                currentTemplateIndex === templates.length - 1 ? 0 : currentTemplateIndex + 1;
            setCurrentTemplateIndex(current);
        }
    }

    function previousMeme() {
        let current = currentTemplateIndex;
        if (templates.length > 1) {
            current =
                currentTemplateIndex === 0 ? templates.length - 1 : currentTemplateIndex - 1;
            setCurrentTemplateIndex(current);
        }
    }


    function toggleBold() {
        bold ? setBold(false) : setBold(true);
    }

    function toggleItalic() {
        italic ? setItalic(false) : setItalic(true);
    }

    const changeFontSize = (event) => {
        setFontSize(event.target.value);
    };

    const handleColorChange = (color) => {
        setColor(color.hex);
    }

    function handleFreestyle(event) {
        setIsFreestyle(event.target.checked)
        if (isFreestyle) {
            event.stopPropagation()
        }
    }


    const [imageProperties, setImageProperties] = useState([])
    const addImage = () => {
        window.addEventListener("mousedown", function getPosition(e) {
            console.log(e.target.type);
            if (e.target.type !== 'textarea') {
                alert("Place image on Canvas or increase size of Canvas")
                return addImage();
            }
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.x;
            let y = e.clientY - rect.y;
            let img = <img className={classes.memeImg} src={selectedImage.url} alt={"meme image"}
                           style={{position: "absolute", left: x, top: y}}/>
            setImages((prev) => [...prev, img]);
            setImageProperties((prev) => [...prev, [x, y, selectedImage.url]]);
            console.log(imageProperties);
            setSelectedImage(null);
        }, {once: true})


    }

    const popover = {
        position: 'absolute',
        zIndex: '2',
    }
    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }

    const saveAsDraft = () => {
        fetch("http://localhost:3030/memeIO/save-draft", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                author: localStorage.user,
                src: templates[currentTemplateIndex].url,
                bold: bold,
                italic: italic,
                color: color,
                fontSize: fontSize,
                isFreestyle: isFreestyle,
                imageProperties: imageProperties,
                canvasWidth: canvasWidth,
                canvasHeight: canvasHeight,
                text: upper,
            }),
        })
    }

    async function getDraft() {
        console.log("getDraft");
        await fetch("http://localhost:3030/memeIO/get-drafts", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                author: localStorage.user,
            }),
        }).then(res => {
            res.json().then(json => {
                let drafts = json.docs;
                console.log(drafts);
                setBold(drafts[0].bold);
                setItalic(drafts[0].italic);
                setColor(drafts[0].color);
                setFontSize(drafts[0].fontSize);
                setIsFreestyle(drafts[0].isFreestyle);
                setUpper(drafts[0].text);
                setImageProperties(drafts[0].imageProperties);
                setCanvasHeight(drafts[0].canvasHeight);
                setCanvasWidth(drafts[0].canvasWidth);
                setImages([]);
                imageProperties.forEach((imageProperty) => {
                    const img = <img className={classes.memeImg} src={imageProperty[2]} alt={"meme image"}
                                     style={{position: "absolute", left: imageProperty[0], top: imageProperty[1]}}/>;
                     setImages((prev) => [...prev, img]);
                })

            })
        })
    }

    return (
        <Container className="memeCreatorContainer">
            <Typography className={classes.heading} variant="h4">
                Hello {localStorage.user}!
            </Typography>
            <Grid container alignItems="start" spacing={3}>
                <Grid item s={1}>
                    <IconButton className="arrows" onClick={previousMeme} aria-label="previous" disabled={isFreestyle}>
                        <ArrowLeft fontSize="large"/>
                    </IconButton>
                </Grid>
                <Grid item s={8} style={{overflow: "hidden"}}>
                    <IconButton
                        className={"textFormatButton"}
                        onClick={toggleBold}
                        style={bold ? {background: "grey"} : {background: "white"}}
                    >
                        <FormatBold/>
                    </IconButton>
                    <IconButton
                        className={"textFormatButton"}
                        onClick={toggleItalic}
                        style={italic ? {background: "grey"} : {background: "white"}}
                    >
                        <FormatItalic/>
                    </IconButton>
                    <IconButton
                        className={"textFormatButton"}
                        onClick={() => {
                            if (displayColorPicker) {
                                setDisplayColorPicker(false)
                            } else {
                                setDisplayColorPicker(true)
                            }
                        }}>
                        <FormatColorTextIcon/>
                    </IconButton>

                    {displayColorPicker ? <div style={popover}>
                        <div style={cover} onClick={() => setDisplayColorPicker(false)}/>
                        <TwitterPicker
                            className="colorPicker"
                            triangle={"hide"}
                            colors={['#D9E3F0', '#FFFFFF', '#000000', '#697689', '#37D67A', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8']}
                            onChange={handleColorChange}
                        /></div> : null
                    }

                    <FormControl className={"textFormatSelect"}>
                        <Select value={fontSize} onChange={changeFontSize}>
                            {fontSizes.map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div className={classes.canvas}>
                        <div className="memeContainer" id={"memeContainer"}>
                            <div id="memeDiv" className={classes.memeCanvas} id={'memeCanvas'}>
                                {!isFreestyle && templates.length > 0 &&
                                <img className={classes.memeImg} src={templates[currentTemplateIndex].url}
                                     alt={"meme image"}/>}
                                {isFreestyle &&
                                <div id="freestyleCanvas" className={classes.freestyleCanvas}> {images} </div>}
                                <textarea
                                    type="text"
                                    className={classes.textFormat + " memeText " + classes.upperText}
                                    placeholder="Enter your text here"
                                    value={upper}
                                    onChange={(event) => setUpper(event.target.value)}
                                />
                            </div>
                        </div>

                    </div>
                </Grid>
                <Grid item s={1}>

                    <IconButton className="arrows" onClick={nextMeme} aria-label="next" disabled={isFreestyle}>
                        <ArrowRight fontSize="large"/>

                    </IconButton>
                </Grid>
                <Grid item s={2}>
                    <ImageSelection
                        isFreestyle={isFreestyle}
                        memeTemplates={templates}
                        setSelectedImages={setSelectedImage}
                        setTemplates={setTemplates}
                        setSelectedImage={setSelectedImage}
                        setCurrentTemplateIndex={setCurrentTemplateIndex}
                        isFreestyle={isFreestyle}
                    />
                    <SpeechInput
                        setCaption={setUpper}
                    />
                    <Accordion>
                        <AccordionSummary
                            aria-label="Expand"
                            aria-controls="additional-actions1-content"
                            id="additional-actions1-header"
                            onClick={() => setIsFreestyle(isFreestyle ? false : true)}
                        >
                            <FormControlLabel
                                aria-label="Acknowledge"
                                control={
                                    <Checkbox
                                        checked={isFreestyle}
                                        onChange={handleFreestyle}
                                    />}
                                label="Advanced Options"
                            />
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField
                                type={"number"}
                                className={"canvasSize"}
                                id="standard-basic"
                                label="Canvas Height"
                                placeholder="Canvas Height"
                                value={canvasHeight}
                                InputProps={{inputProps: {max: maxHeight, min: minHeight}}}
                                onChange={(event) => setCanvasHeight(event.target.value)}
                            />
                            <TextField
                                type={"number"}
                                className={"canvasSize"}
                                id="standard-basic"
                                label="Canvas Width"
                                placeholder="Canvas Width"
                                value={canvasWidth}
                                InputProps={{inputProps: {max: maxWidth, min: minWidth}}}
                                onChange={(event) => setCanvasWidth(event.target.value)}
                            />
                        </AccordionDetails>
                        <AccordionDetails>
                            <Tooltip title="Click on canvas to place your selected template" arrow>
                                <Button
                                    className="classes.buttonStyle selection"
                                    variant="contained"
                                    onClick={addImage}
                                    color="primary"
                                    disabled={(selectedImage === null)}
                                >
                                    Place Template
                                </Button>
                            </Tooltip>

                            <Button
                                className="classes.buttonStyle selection"
                                variant="contained"
                                onClick={() => setImages([])}
                                color="secondary"
                                disabled={(images.length === 0)}
                            >
                                Clear Canvas
                            </Button>
                        </AccordionDetails>
                    </Accordion>

                    <Generator
                        isFreestyle={isFreestyle}
                        canvasHeight={canvasHeight}
                        canvasWidth={canvasWidth}
                        template={templates[currentTemplateIndex]}
                        fontSize={fontSize}
                        text={upper}/>
                    <Button
                        onClick={saveAsDraft}>
                        Save as Draft
                    </Button>
                    <Button
                        onClick={() => getDraft()}>
                        Continue Draft
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

export default MemeCreator;
