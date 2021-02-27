import React, {useState, useRef, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/Camera";
import "./../../css/ImageSelection/imageSelection.css";

import Webcam from "react-webcam";
import {TextField} from "@material-ui/core";

// aligns modal in center of screen
function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        maxHeight: window.innerHeight - 100,
        overflow: 'auto',

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

/**
 * component for uploading photo from connected camera
 * gets params in ImageSelection component
 */
const Camera = params => {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [save, setSave] = React.useState(true)

    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [templateTitle, setTemplateTitle] = useState("")
    const [error, setError] = useState({
        show: false,
        text: "",
    });



    //open and close modal
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setError({show:false, text:""});
    };

    //remove error message when new title is entered
    const handleChange = (event) => {
        setError({show:false, text:""});
        setTemplateTitle(event.target.value);
    }


    //capture photo with webcam (when cheese is pressed)
    const capture = (() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setSave(false);
    });

    /**
     * call handleSave in ImageSelection to save photo as template
     * check for missing or duplicate template title
     */
    async function saveCapturedPicture() {
        if (templateTitle === '') {
            setError({show: true, text: "Please enter a title"});
            return;
        }
        let isDuplicate = false;
        await fetch("http://localhost:3030/memeIO/get-templates").then(res => {
            res.json().then(json => {
                json.docs.forEach(template => {
                    if (template.templateName === templateTitle && !isDuplicate) {
                        setError({show: true, text: "Template title is already used"});
                        isDuplicate = true;
                    }
                });
        }).then(() => {
                if (!isDuplicate) {
                    params.handleSave(templateTitle, imgSrc, false);
                    handleClose();
                }
            }
        )})
    }

    return (
        <div>
            <Button
                className="classes.buttonStyle modal"
                startIcon={<CameraIcon/>}
                variant="contained"
                onClick={handleOpen}
                color="secondary"
            >
                Photo from camera
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <div style={modalStyle} className={classes.paper}>
                    <>
                        <Webcam
                            className="camera"
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                        />
                        <TextField
                            error={error.show}
                            helperText={error.text}
                            id="standard-basic"
                            label="Template Title"
                            placeholder="Template Title"
                            value={templateTitle}
                            onChange={(event) => handleChange(event)}
                        />
                        <Button
                            className="classes.buttonStyle modal"
                            variant="contained"
                            onClick={capture}
                            color="secondary"
                        >
                            Cheese!
                        </Button>
                        {/*show preview of photo after capture*/}
                        {imgSrc && (
                            <img
                                className="camera"
                                alt="Preview"
                                src={imgSrc}
                            />
                        )}
                        <Button
                            className="classes.buttonStyle modal"
                            variant="contained"
                            onClick={saveCapturedPicture}
                            color="primary"
                            disabled={save}
                        >
                            Save picture
                        </Button>
                    </>
                </div>
            </Modal>
        </div>
    );
}

export default Camera;
