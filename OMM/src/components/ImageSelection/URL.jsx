import React, {useState, useRef, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import LinkIcon from '@material-ui/icons/Link';

import AuthService from "../../services/auth.service";

import "./../../css/ImageSelection/imageSelection.css";


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

    const handleOpen = () => {
        setTitle('');
        setUrl('');
        setURLDisabled(false);
        setScreenShotDisabled(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                        if (URLDisabled) {
                            handleScreenshot()
                        } else {
                            saveTemplate();
                        }
                    }
                }
            )
        })


    }

    async function saveTemplate() {
        console.log(AuthService.getTokenHeader());
        fetch("http://localhost:3030/memeIO/save-template", {
            method: "POST",
            mode: "cors",
            headers: AuthService.getTokenHeader(),
            body: JSON.stringify({
                internetSource: true,
                title: title,
                url: url,
            }),
        }).then((res) => {
            return res.json();
        }).then((data) => {
            params.handleSave(data);
            setIsLoading(false);
            handleClose();
        });
    }

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
            params.handleSave(data);
            setIsLoading(false);
            handleClose();
        });
    }

    const handleChange = ({target}) => {
        setScreenShotDisabled(target.name == 'url' && (target.value !== ""));
        setURLDisabled(target.name == 'screenshot' && (target.value !== ""));
        setUrl((prev) => target.value);
    }

    const handleChangeTitle = ({target}) => {
        setError({show: false, text: ""});
        setTitle(target.value);
    }


    const getTemplateFromURL = (event) => {
        if (event.key === 'Enter') {
            params.handleSave("title", url, true);
        }
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
                        onChange={handleChange}
                        onKeyPress={getTemplateFromURL}/>

                    <TextField
                        disabled={screenShotDisabled}
                        name="screenshot"
                        className="modal"
                        label="Screenshot Image from URL"
                        onChange={handleChange}
                        onKeyPress={handleSave}/>
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
