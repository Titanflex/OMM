import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import ArrowRight from "@material-ui/icons/ChevronRight";
import ArrowLeft from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import LoadIcon from "@material-ui/icons/Refresh";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import ImageSelection from "../ImageSelection/ImageSelection";


import "./../../css/MemeCreator/memeCreator.css";
import TextField from "@material-ui/core/TextField";
import {FormatBold, FormatItalic} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

function MemeCreator() {
    const [upper, setUpper] = useState("");
    const [lower, setLower] = useState("");
    const [memes, setMemes] = useState([{url: "https://image.stern.de/7528150/t/sU/v3/w1440/r0/-/harold-hide-the-pain-meme-09.jpg"}]);
    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [color, setColor] = useState("white");
    const [fontSize, setFontSize] = useState("30")

    const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 46, 48, 50]

    const useStyles = makeStyles((theme) => ({
        textFormat: {
            fontWeight: bold ? 'bold' : 'normal',
            fontStyle: italic ? 'italic' : 'normal',
            "-webkit-text-fill-color": color,
            fontSize: fontSize,
        },
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
                url: memes[currentMemeIndex].url,
                upper: upper,
                lower: lower,
            }),
        }).then((res) => {
            loadMeme();
        });
    }


    function toggleBold() {
        bold ? setBold(false) : setBold(true)
        console.log(bold);
    }

    function toggleItalic() {
        italic ? setItalic(false) : setItalic(true)
    }

    const changeTextColor = (event) => {
        setColor(event.target.value);
    }

    const changeFontSize = (event) => {
        setFontSize(event.target.value);
    }

    return (
        <Container className="memeCreatorContainer">
            <Grid container spacing={1}>
                <Grid item s={1} alignItems="center">
                    <IconButton className="arrows" onClick={previousMeme} aria-label="previous">
                        <ArrowLeft fontSize="large"/>
                    </IconButton>
                </Grid>
                <Grid item s={6} alignItems="center">

                    <IconButton
                        className={'textFormatButton'}
                        onClick={toggleBold}
                        style={bold ? {background: 'grey'} : {background: 'white'}}
                    >
                        <FormatBold/>
                    </IconButton>
                    <IconButton
                        className={'textFormatButton'}
                        onClick={toggleItalic}
                        style={italic ? {background: 'grey'} : {background: 'white'}}
                    >
                        <FormatItalic/>
                    </IconButton>
                    <FormControl className={'textFormatSelect'}>
                        <Select
                            label={"white"}
                            value={color}
                            onChange={changeTextColor}
                        >
                            <MenuItem value="white">
                                White
                            </MenuItem>
                            <MenuItem value={"red"}>Red</MenuItem>
                            <MenuItem value={"black"}>Black</MenuItem>
                            <MenuItem value={"grey"}>Grey</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={'textFormatSelect'}>
                        <Select
                            value={fontSize}
                            onChange={changeFontSize}
                        >
                            {fontSizes.map((size) => (
                                <MenuItem key={size} value={size}>{size}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <div className="memeContainer">
                         <textarea
                             type="text"
                             className={classes.textFormat + " memeText " + " upper "}
                             placeholder="Upper text"
                             value={upper}
                             onChange={(event) => setUpper(event.target.value)}
                         />
                        <div id="memeDiv">
                            <img
                                src={memes[currentMemeIndex].url}
                                alt={"meme image"}
                            />
                        </div>
                        <textarea
                            className={classes.textFormat + ' memeText ' + ' lower '}
                            placeholder="Lower text"
                            value={lower}
                            onChange={(event) => setLower(event.target.value)}

                        />
                    </div>
                </Grid>
                <Grid item s={1} alignItems="center">
                    <IconButton className="arrows" onClick={nextMeme} aria-label="next">
                        <ArrowRight fontSize="large"/>
                    </IconButton>
                </Grid>
                <Grid item s={4}>


                    <ImageSelection setMemes={setMemes} setUpper={setUpper} setLower={setLower}/>
                    <TextField
                        id="standard-basic"
                        label="Meme Title"
                    />

                    <div className="dataBaseControls">
                        <Button
                            className="classes.buttonStyle"
                            startIcon={<LoadIcon/>}
                            variant="contained"
                            onClick={loadMeme}
                            color="secondary"
                        >
                            Load
                        </Button>
                        <Button
                            className="classes.buttonStyle"
                            startIcon={<SaveIcon/>}
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
