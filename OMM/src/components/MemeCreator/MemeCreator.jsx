import React, {useState, useEffect, useRef} from "react";
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
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";

import ArrowRight from "@material-ui/icons/ChevronRight";
import ArrowLeft from "@material-ui/icons/ChevronLeft";
import FormatColorTextIcon from '@material-ui/icons/FormatColorText';
import {
  FormatBold,
  FormatItalic,
} from "@material-ui/icons";

import { SketchPicker } from 'react-color';

import ImageSelection from "../ImageSelection/ImageSelection";
import Generator from "../MemeCreator/Generator";
import AuthService from "../../services/auth.service";

import "./../../css/MemeCreator/memeCreator.css";
import TemplateOverview from "../ImageSelection/TemplateOverview";
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

function MemeCreator() {
  const [title, setTitle] = useState("");

  const [upper, setUpper] = useState("");
  const [templates, setTemplates] = useState([
    {
      url:
        "https://image.stern.de/7528150/t/sU/v3/w1440/r0/-/harold-hide-the-pain-meme-09.jpg", name: "Hide the pain Harold",
    },
  ]);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [color, setColor] = useState("white");
  const [fontSize, setFontSize] = useState("30");

  const [canvasWidth, setCanvasWidth] = useState(350);
  const [canvasHeight, setCanvasHeight] = useState(200);
  const [amountImages, setAmountImages] = useState(1);

  const [posUpperTop, setPosUpperTop] = useState(20);
  const [posUpperLeft, setPosUpperLeft] = useState(10);

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
      height:'100%',
      overflow:'hidden',
    }, memeCanvas:{
      width: canvasWidth +"px",
      'min-width': '350px',
      'min-height': '200px',
      'max-width':'1000px',
      'max-height':'1000px',
      height: (amountImages === 1) ? 'auto' : (canvasHeight +"px"),
      border: '1px solid grey',
    },memeImg:{
      width: (amountImages === 1) ? (canvasWidth +"px") : "350px",
      'min-width': '350px',
      'min-height': '200px',
      'max-width':'1000px',
      'max-height':'1000px',
      height: 'auto',
      display: 'block',
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

  const addImage = () => {
    setAmountImages((prevState => prevState+1));
    window.addEventListener("mousedown", function getPosition(e){
      console.log("x: " + e.clientX +" y: " + e.clientY + e.target);
    }, {once:true})

  }

  return (
    <Container className="memeCreatorContainer">
      <Typography className={classes.heading} variant="h4">
        Hello {localStorage.user}!
      </Typography>
      <Grid container spacing={1}>
        <Grid item s={1} alignItems="center">
          <IconButton className="arrows" onClick={previousMeme} aria-label="previous">
            <ArrowLeft fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item s={8} alignItems="center">
          <IconButton
            className={"textFormatButton"}
            onClick={toggleBold}
            style={bold ? { background: "grey" } : { background: "white" }}
          >
            <FormatBold />
          </IconButton>
          <IconButton
            className={"textFormatButton"}
            onClick={toggleItalic}
            style={italic ? { background: "grey" } : { background: "white" }}
          >
            <FormatItalic />
          </IconButton>
          <IconButton
            className={"textFormatButton"}
            onClick={() => {
              if(displayColorPicker){
                setDisplayColorPicker(false)
              }else{
                setDisplayColorPicker(true)}}}>
            <FormatColorTextIcon />
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

          <div className="memeContainer" id={"memeContainer"}>

            <div>
              <textarea
                type="text"
                className={classes.textFormat + " memeText " + classes.upperText}
                placeholder="Enter your text here"
                value={upper}
                onChange={(event) => setUpper(event.target.value)}
              />
            </div>
            <div id="memeDiv" className={classes.memeCanvas}>
              <img className={classes.memeImg} src={templates[currentTemplateIndex].url} alt={"meme image"} />
            </div>


          </div>
        </Grid>
        <Grid item s={1} alignItems="center">
          <IconButton className="arrows" onClick={nextMeme} aria-label="next">
            <ArrowRight fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item s={2}>
          <TemplateOverview
              memeTemplates={templates}
              setCurrentMemeIndex={setCurrentTemplateIndex}
          />
          <ImageSelection
            setTemplates={setTemplates}
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
          <div>
          <TextField
              type={"number"}
              className="textFieldTitleFormat selection"
              id="standard-basic"
              label="Canvas Height"
              placeholder="Canvas Height"
              value={canvasHeight}
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
          <br/>
            <Button
                className="classes.buttonStyle selection"
                variant="contained"
                onClick={addImage}
                color="secondary"
                disabled
            >
              Add Image
            </Button>
            <Generator
                title={title}/>
          </div>

        </Grid>
      </Grid>
    </Container>
  );
}

export default MemeCreator;
