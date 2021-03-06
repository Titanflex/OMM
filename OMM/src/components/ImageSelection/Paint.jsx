import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";

import PaintCanvas from "./PaintCanvas";

import "./../../css/ImageSelection/imageSelection.css";
import {Gesture} from "@material-ui/icons";

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
 * component renders modal for paint canvas
 * gets params from ImageSelection component
 */
const Paint = params => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
 

    //open and close modal
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    //call handle save in image selection
    function handleSave(title, url){
        params.handleSave(title, url, false);
        handleClose();      
    }

    return (
        <div>
            <Button
                className="classes.buttonStyle modal"
                startIcon={<Gesture />}
                variant="contained"
                onClick={handleOpen}
                color="secondary"
            >
                Draw your own
            </Button>
            
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <div style={modalStyle} className={classes.paper}>
                    <PaintCanvas
                        handleSave={handleSave}
                    />
                </div>
            </Modal>


        </div>
    );
}

export default Paint;
