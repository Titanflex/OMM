import React, { useState, useEffect } from "react";
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
import SaveIcon from "@material-ui/icons/Save";
import LoadIcon from "@material-ui/icons/Refresh";
import {
  FormatBold,
  FormatColorText,
  FormatSize,
  FormatItalic,
} from "@material-ui/icons";

import ImageSelection from "../ImageSelection/ImageSelection";
import AuthService from "../../services/auth.service";

import "./../../css/MemeCreator/memeCreator.css";
import TemplateOverview from "../ImageSelection/TemplateOverview";

function MemeCreator() {
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [upper, setUpper] = useState("");
  const [lower, setLower] = useState("");
  const [memes, setMemes] = useState([
    {
      url:
        "https://image.stern.de/7528150/t/sU/v3/w1440/r0/-/harold-hide-the-pain-meme-09.jpg", name: "Hide the pain Harold",
    },
  ]);
  const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [color, setColor] = useState("white");
  const [fontSize, setFontSize] = useState("30");

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
    }
  }));

  const classes = useStyles();

  function nextMeme() {
    let current = currentMemeIndex;
    if (memes.length > 1) {
      current =
        currentMemeIndex === memes.length - 1 ? 0 : currentMemeIndex + 1;
      setUpper(memes[current].upper);
      setLower(memes[current].lower);
      setCurrentMemeIndex(current);
    }
  }

  function previousMeme() {
    let current = currentMemeIndex;
    if (memes.length > 1) {
      current =
        currentMemeIndex === 0 ? memes.length - 1 : currentMemeIndex - 1;
      setUpper(memes[current].upper);
      setLower(memes[current].lower);
      setCurrentMemeIndex(current);
    }
  }

  async function loadMeme() {
    const res = await fetch("http://localhost:3030/memeIO/get-memes");
    const json = await res.json();
    setUpper(json.docs[0].upper);
    setLower(json.docs[0].lower);
    setMemes(json.docs);
    setCurrentMemeIndex(0);
  }

  function saveMeme() {
    fetch("http://localhost:3030/memeIO/save-meme", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        url: memes[currentMemeIndex].url,
        upper: upper,
        lower: lower,
        creator: localStorage.user,
        isPublic: isPublic,
        creationDate: Date.now,
      }),
    }).then((res) => {
      loadMeme();
    });
  }

  const handleRadioChange = (event) => {
    event.target.value === 'public' ? setIsPublic(true) : setIsPublic(false);
  }


  function toggleBold() {
    bold ? setBold(false) : setBold(true);
    console.log(bold);
  }

  function toggleItalic() {
    italic ? setItalic(false) : setItalic(true);
  }

  const changeTextColor = (event) => {
    setColor(event.target.value);
  };

  const changeFontSize = (event) => {
    setFontSize(event.target.value);
  };


  return (
    <Container className="memeCreatorContainer">
      <Typography className={classes.heading} variant="h4">
        Hello {localStorage.user}!
      </Typography>
      <TemplateOverview memeTemplates={memes} setCurrentMemeIndex={setCurrentMemeIndex} />
      <Grid container spacing={1}>
        <Grid item s={1} alignItems="center">
          <IconButton onClick={previousMeme} aria-label="previous">
            <ArrowLeft fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item s={6} alignItems="center">
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
          <FormControl className={"textFormatSelect"}>
            <Select label={"white"} value={color} onChange={changeTextColor}>
              <MenuItem value="white">White</MenuItem>
              <MenuItem value={"red"}>Red</MenuItem>
              <MenuItem value={"black"}>Black</MenuItem>
              <MenuItem value={"grey"}>Grey</MenuItem>
            </Select>
          </FormControl>

          <FormControl className={"textFormatSelect"}>
            <Select value={fontSize} onChange={changeFontSize}>
              {fontSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="memeContainer">
            <div>
              <textarea
                type="text"
                className={classes.textFormat + " memeText " + " upper "}
                placeholder="Upper text"
                value={upper}
                onChange={(event) => setUpper(event.target.value)}
              />
            </div>
            <div id="memeDiv">
              <img src={memes[currentMemeIndex].url} alt={"meme image"} />
            </div>
            <textarea
              className={classes.textFormat + " memeText " + " lower "}
              placeholder="Lower text"
              value={lower}
              onChange={(event) => setLower(event.target.value)}
            />
          </div>
        </Grid>
        <Grid item s={1} alignItems="center">
          <IconButton className="arrows" onClick={nextMeme} aria-label="next">
            <ArrowRight fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item s={4}>
          <ImageSelection
            setMemes={setMemes}
            setUpper={setUpper}
            setLower={setLower}
          />

          {/* Text Field for Meme Title*/}
          <TextField
            className="textFieldTitleFormat"
            id="standard-basic"
            label="Meme Title"
            placeholder="Meme Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          {/* Radio Button for selecting public/private/unlisted*/}
          <Grid>
            <FormControl component="fieldset" className={"radioButtonFormat"}>
              <FormLabel component="legend">Publicity</FormLabel>
              <RadioGroup aria-label="publicity" name="publicity" defaultValue="public" onChange={handleRadioChange}>
                <FormControlLabel className="radioButton" value="public" control={<Radio />} label="public" />
                <FormControlLabel className="radioButton" value="private" control={<Radio />} label="private" />
                <FormControlLabel className="radioButton" value="unlisted" control={<Radio />} label="unlisted" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <div className="dataBaseControls">
            <Button
              className="classes.buttonStyle"
              startIcon={<LoadIcon />}
              variant="contained"
              onClick={loadMeme}
              color="secondary"
            >
              Load
            </Button>
            <Button
              className="classes.buttonStyle"
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={saveMeme}
              color="secondary"
            >
              Save
            </Button>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MemeCreator;
