import React, {useState, useRef} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/Camera";
import "./../../css/ImageSelection/imageSelection.css";

import Webcam from "react-webcam";
import {TextField} from "@material-ui/core";


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

const Camera = params => {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [save, setSave] = React.useState(true)

    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [templateTitle, setTemplateTitle] = useState("")

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setSave(false);
    }, [webcamRef, setImgSrc]);

    function saveCapturedPicture() {
        if(templateTitle === ""){
            alert("Enter a title for your new template");
            return;
        }
        params.handleSave(templateTitle, imgSrc, false);
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
                            id="standard-basic"
                            label="Template Title"
                            placeholder="Template Title"
                            value={templateTitle}
                            onChange={(event) => setTemplateTitle(event.target.value)}
                        />
                        <Button
                            className="classes.buttonStyle modal"
                            variant="contained"
                            onClick={capture}
                            color="secondary"
                        >
                            Cheese!
                        </Button>

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
                            color="secondary"
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
