import React, {useState, useRef, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import LinkIcon from '@material-ui/icons/Link';

import AuthService from "../../services/auth.service";

import "./../../css/ImageSelection/imageSelection.css";

//aligns modal in center of screen
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


/**
 * component for uploading image from URL/screenshot from URL
 * @param params, set in ImageSelection component
 * @returns {JSX.Element}
 */
const URL = params => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [URLDisabled, setURLDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [screenShotDisabled, setScreenShotDisabled] = useState(false);
    const [error, setError] = useState({
        show: false,
        text: "",
    });

    //open close modal
    const handleOpen = () => {
        setTitle('');
        setUrl('');
        setURLDisabled(false);
        setScreenShotDisabled(false);
        setOpen(true);
    };
    const handleClose = () => {
        setIsLoading(false);
        setOpen(false);
    };

    /**
     * save image URL as template or make screenshot of website
     * check for missing or duplicate template title
     */
    async function handleSave() {
        if (title === '') {
            setError({show: true, text: "Please enter a title"});
            return;
        }
        let isDuplicate = false;
        await fetch("http://localhost:3030/memeIO/get-templates").then(res => {
            res.json().then(json => {
                json.docs.forEach(template => {
                    if (template.templateName === title && !isDuplicate) {
                        setError({show: true, text: "Template title is already used"});
                        isDuplicate = true;
                    }
                });
            }).then(() => {
                    if (!isDuplicate) {
                        setIsLoading(true);
                        if (URLDisabled) { //make screenshot from user provided URL
                            handleScreenshot();
                        } else {
                            params.handleSave(title, url, true); //download image from user provided URL
                            handleClose();
                        }
                    }
                }
            )
        })
    }


    /**
     * send url to server to make screenshot
     * receives image data
     * gives data to imageSelection component to create template
     * @returns {Promise<void>}
     */
    async function handleScreenshot() {
        await fetch("http://localhost:3030/memeIO/webshot", {
            method: "POST",
            mode: "cors",
            headers: AuthService.getTokenHeader(),
            body: JSON.stringify({
                url: url,
                title: title
            }),
        }).then((res) => {
            return res.json();
        }).then((data) => {
            params.addTemplate(data);
            handleClose();
        });
    }

   //handle URL input
    const handleChange = ({target}) => {
        setScreenShotDisabled(target.name === 'url' && (target.value !== ""));
        setURLDisabled(target.name === 'screenshot' && (target.value !== ""));
        setUrl((prev) => target.value);
    }

    //remove error message when new title is entered
    const handleChangeTitle = ({target}) => {
        setError({show: false, text: ""});
        setTitle(target.value);
    }


    return (
        <div>
            <Button
                className="classes.buttonStyle modal"
                startIcon={<LinkIcon/>}
                variant="contained"
                onClick={handleOpen}
                color="secondary"
            >
                Get Image from URL
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <div style={modalStyle} className={classes.paper}>

                    <TextField
                        disabled={URLDisabled}
                        name="url"
                        className="modal"
                        label="Load Image from URL"
                        onChange={handleChange}/>

                    <TextField
                        disabled={screenShotDisabled}
                        name="screenshot"
                        className="modal"
                        label="Screenshot Image from URL"
                        onChange={handleChange}/>
                    <TextField
                        error={error.show}
                        helperText={error.text}
                        name="title"
                        className="modal"
                        label="Title"
                        onChange={handleChangeTitle}
                    />
                    <Button
                        className="classes.buttonStyle modal"
                        variant="contained"
                        onClick={handleSave}
                        color="secondary"
                    >
                        {isLoading ? <CircularProgress/> : "Load Image"}

                    </Button>
                </div>
            </Modal>


        </div>
    );
}

export default URL;
