import React, {useState, useRef, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import MailIcon from '@material-ui/icons/Mail';
import ImageIcon from '@material-ui/icons/Image';


import "./../../css/ImageSelection/imageSelection.css";
import SaveIcon from "@material-ui/icons/Save";
import domtoimage from "dom-to-image";
import {FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField} from "@material-ui/core";


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
        domtoimage.toPng(meme).then(function(dataUrl) {
            setGeneratedMeme(dataUrl);

        }).catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
      if(!isLocal){ ////TODO server side generation
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
                Generate meme
            </Button>
            
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <div style={modalStyle} className={classes.paper}>

                    <div>
                    <FormControl component="fieldset" className={"radioButtonFormat"}>
                        <FormLabel component="legend">Generate</FormLabel>
                        <RadioGroup defaultValue="local" onChange={handleGeneration}>
                            <FormControlLabel className="radioButton" value="local" control={<Radio />} label="local" />
                            <FormControlLabel className="radioButton" value="server-side" control={<Radio />} label="server-side" />
                            <FormControlLabel className="radioButton" value="third-party" control={<Radio />} label="third-party" />
                        </RadioGroup>
                    </FormControl>
                        {/* Radio Button for selecting public/private/unlisted*/}
                            <FormControl component="fieldset" className={"radioButtonFormat"}>
                                <FormLabel component="legend">Publicity</FormLabel>
                                <RadioGroup aria-label="publicity" name="publicity" defaultValue="public" onChange={handlePublicity}>
                                    <FormControlLabel className="radioButton" value="public" control={<Radio />} label="public" />
                                    <FormControlLabel className="radioButton" value="private" control={<Radio />} label="private" />
                                    <FormControlLabel className="radioButton" value="unlisted" control={<Radio />} label="unlisted" />
                                </RadioGroup>
                            </FormControl>

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
                        //onClick={}
                        color="secondary"
                        disabled
                    >
                        Share
                    </Button>
                </div>
                </div>
            </Modal>


        </div>
    );
}

export default Generator;
