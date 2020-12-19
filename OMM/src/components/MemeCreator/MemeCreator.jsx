import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import ArrowRight from "@material-ui/icons/ChevronRight";
import ArrowLeft from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import LoadIcon from "@material-ui/icons/Refresh";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import ConfirmationPopUp from "./ConfirmationPopUp"

import "./../../css/MemeCreator/memeCreator.css";

function MemeCreator() {
  const [upper, setUpper] = useState("");
  const [lower, setLower] = useState("");
  const [memes, setMemes] = useState([{url: "https://image.stern.de/7528150/t/sU/v3/w1440/r0/-/harold-hide-the-pain-meme-09.jpg"}]);
  const [currentMemeIndex, setCurrentMemeIndex] = useState(0);

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

  async function getMoreMemes() {
    const res = await fetch("https://api.imgflip.com/get_memes");
    const json = await res.json();
    console.log(json.data.memes);
    setUpper("");
    setLower("");
    setMemes(json.data.memes);
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

  return (
    <Container className = "memeCreatorContainer" >
    <Grid container spacing={1}>
      <Grid item s={1}  alignItems="center">
        <IconButton onClick={previousMeme} aria-label="previous">
          <ArrowLeft fontSize="large" />
        </IconButton>
      </Grid>
      <Grid item s={6} alignItems="center">
        <div className="memeContainer">
          <textarea
            type="text"
            className="memeText upper"
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
            className="memeText lower"
            placeholder="Lower text"
            value={lower}
            onChange={(event) => setLower(event.target.value)}
          />
        </div>
      </Grid>
      <Grid item s={1} alignItems="center">
        <IconButton onClick={nextMeme} aria-label="next">
          <ArrowRight fontSize="large" />
        </IconButton>
      </Grid>
      <Grid item s={4}>
        <Button
          className = "classes.buttonStyle"
          variant="contained"
          onClick={() => getMoreMemes()}
          color="secondary"
          s
        >
          Ich will mehr Memes!
        </Button>
        <div className = "dataBaseControls">
        <Button
          className = "classes.buttonStyle"
          startIcon={<LoadIcon />}
          variant="contained"
          onClick={loadMeme}
          color="secondary"
        >
          Load
        </Button>
        <Button
          className = "classes.buttonStyle"
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
