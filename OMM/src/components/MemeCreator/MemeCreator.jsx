import React, {useState} from "react";
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

import {SketchPicker} from 'react-color';

import ImageSelection from "../ImageSelection/ImageSelection";
import Generator from "../MemeCreator/Generator";


import "./../../css/MemeCreator/memeCreator.css";
import TemplateOverview from "../ImageSelection/TemplateOverview";

import Checkbox from "@material-ui/core/Checkbox";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Tooltip from "@material-ui/core/Tooltip";

function MemeCreator() {
    const [title, setTitle] = useState("");

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
            border: (isFreestyle) ? '1px solid grey' : 'none',
        }, memeImg: {
            width: '350px',
            height: 'auto',
            display: 'block',
            zIndex: "-1",
        }, canvas: {
            width:  (isFreestyle) ? canvasWidth + "px" : '350px',
            'min-width': minWidth + 'px',
            'min-height': minHeight + 'px',
            'max-width': maxWidth + 'px',
            'max-height': maxHeight + 'px',
            overflow: 'hidden',
        }
    }));

    const classes = useStyles();

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
            setUpper(templates[current].upper);
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
        setDisplayColorPicker(false);
    }

    function handleFreestyle(event) {
        setIsFreestyle(event.target.checked)
        if (isFreestyle) {
            event.stopPropagation()
        }
    }


    const addImage = () => {
        window.addEventListener("mousedown", function getPosition(e) {
            if (e.target.type != 'textarea') {
                alert("Place image on Canvas or increase size of Canvas")
                return addImage();
            }
            var rect = e.target.getBoundingClientRect();
            console.log(selectedImage);
            var x = e.clientX - rect.x;
            var y = e.clientY - rect.y;
            let img = <img className={classes.memeImg} src={selectedImage.url} alt={"meme image"}
                           style={{position: "absolute", left: x, top: y}}/>
            setImages((prev) => [...prev, img]);
            setSelectedImage(null);
        }, {once: true})


    }



    return (
        <Container className="memeCreatorContainer">
            <Typography className={classes.heading} variant="h4">
                Hello {localStorage.user}!
            </Typography>
            <Grid container spacing={1}>
                <Grid item s={1} alignItems="center">
                    <IconButton className="arrows" onClick={previousMeme} aria-label="previous">
                        <ArrowLeft fontSize="large"/>
                    </IconButton>
                </Grid>
                <Grid item s={8} alignItems="center" style={{width: "55%", overflow: "hidden"}}>
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
                    {displayColorPicker &&
                    <SketchPicker
                        className="colorPicker"
                        onChange={handleColorChange}
                    />}
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
                            <div id="memeDiv" className={classes.memeCanvas}>
             <textarea
                 type="text"
                 className={classes.textFormat + " memeText " + classes.upperText}
                 placeholder="Enter your text here"
                 value={upper}
                 onChange={(event) => setUpper(event.target.value)}
             />
                                {!isFreestyle &&
                                <img className={classes.memeImg} src={templates[currentTemplateIndex].url}
                                     alt={"meme image"}/>}
                                {isFreestyle && images}

                            </div>
                        </div>

                    </div>
                </Grid>
                <Grid item s={1} alignItems="center">
                    <IconButton className="arrows" onClick={nextMeme} aria-label="next">
                        <ArrowRight fontSize="large"/>
                    </IconButton>
                </Grid>
                <Grid item s={2} alignItems="right" style={{width: "30%", minWidth:"400px"}}>
                    <TemplateOverview
                        isFreestyle={isFreestyle}
                        memeTemplates={templates}
                        setCurrentMemeIndex={setCurrentTemplateIndex}
                        setSelectedImages={setSelectedImage}
                        
                    />
                    <ImageSelection
                        setTemplates={setTemplates}
                        setSelectedImage={setSelectedImage}
                        isFreestyle={isFreestyle}
                    />

                    {/* Text Field for Meme Title*/}
                    <TextField
                        className="textFieldTitleFormat selection"
                        id="standard-basic"
                        label="Meme Title"
                        placeholder="Meme Title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />

                    <Accordion>
                        <AccordionSummary
                            aria-label="Expand"
                            aria-controls="additional-actions1-content"
                            id="additional-actions1-header"
                            onClick={() => setIsFreestyle(isFreestyle?false:true)}
                        >
                            <FormControlLabel
                                aria-label="Acknowledge"
                                control={
                                    <Checkbox
                                    checked={isFreestyle}
                                    onChange={handleFreestyle}
                                    />}
                                label="Freestyle"
                            />
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField
                                type={"number"}
                                className="textFieldTitleFormat selection"
                                id="standard-basic"
                                label="Canvas Height"
                                placeholder="Canvas Height"
                                value={canvasHeight}
                                min={300}
                                onChange={(event) => setCanvasHeight(event.target.value)}
                            />

                            <TextField
                                type={"number"}
                                className="textFieldTitleFormat selection"
                                id="standard-basic"
                                label="Canvas Width"
                                placeholder="Canvas Width"
                                value={canvasWidth}
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
                                onClick={()=> setImages([])}
                                color="secondary"
                                disabled={(images.length === 0)}
                            >
                                Clear Canvas
                            </Button>
                        </AccordionDetails>
                    </Accordion>

                    <Generator
                        title={title}
                        isFreestyle={isFreestyle}
                        canvasHeight={canvasHeight}
                        canvasWidth={canvasWidth}/>


                </Grid>
            </Grid>
        </Container>
    );
}

export default MemeCreator;
