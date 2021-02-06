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

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";



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
    const [isLocal, setIsLocal] = useState(true);
    const [fileSize, setFileSize] = useState(400);
    const [isPublic, setIsPublic] = useState(true);


    const handleOpen = () => {
        if(params.title === ""){
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

    const handleGeneration = (event) => {
        event.target.value === 'local' ? setIsLocal(true) : setIsLocal(false);
    }

    const handlePublicity = (event) => {
        event.target.value === 'public' ? setIsPublic(true) : setIsPublic(false);
    }

    function generateMeme() {
        let meme = document.getElementById("memeContainer");
        if(isLocal){
            let options;
            if(params.isFreestyle) options = {width:params.canvasWidth, height: params.canvasHeight}
            domtoimage.toBlob(meme, options).then(function(blob) {
                setGeneratedMeme(blob);
            });
        }
      if(!isLocal){ ////TODO server side generation (phantomJS?)

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
                                onload: (response) =>{
                                    console.log(response);
                                    setGeneratedMemeUrl(response);
                                }


                            }
                        }}
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
