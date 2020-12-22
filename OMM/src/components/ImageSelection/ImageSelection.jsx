import React, {useState} from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CameraIcon from "@material-ui/icons/Camera";
import {CloudDownload, FolderOpen, Gesture} from "@material-ui/icons";

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
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ImageSelection = params => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    console.log('open');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [url, setUrl] = useState((''));
  const handleChange = ({target}) => {
    setUrl((prev) => target.value);
  }
  const handleSubmit = (event) =>{
    console.log(`Pressed keyCode ${event.key}`);
    if (event.key === 'Enter') {
      params.setMemes([{url: url}]);
      event.preventDefault();
      handleClose();
    }
  }

  async function getMoreMemes() {
    const res = await fetch("https://api.imgflip.com/get_memes");
    const json = await res.json();
    console.log(json.data.memes);
    params.setMemes(json.data.memes);
    handleClose();
  }

  return (
      <div>
      <Button
          className = "classes.buttonStyle"
          variant="contained"
          color="secondary"
          onClick={handleOpen}>
        Ich will mehr memes!
      </Button>
   <Modal
       open ={open}
       onClose={handleClose}
       aria-labelledby="simple-modal-title"
       aria-describedby="simple-modal-description">
     <div style={modalStyle} className={classes.paper}>
       <h2 id="simple-modal-title">Select your image</h2>
       <Button
           className = "classes.buttonStyle modal"
           startIcon={<FolderOpen />}
           variant="contained"
           //onClick={loadMeme}
           color="secondary"
           disabled
       >
         Upload own pictures
       </Button>
       <Button
           className = "classes.buttonStyle modal"
           startIcon={<CloudDownload />}
           variant="contained"
           onClick={() => {getMoreMemes()}}
           color="secondary"
       >
         Get Images form ImageFlip
       </Button>
       <Button
           className = "classes.buttonStyle modal"
           startIcon={<CameraIcon />}
           variant="contained"
           //onClick={saveMeme}
           color="secondary"
           disabled
       >
        Photo from camera
       </Button>
       <Button
           className = "classes.buttonStyle modal"
           startIcon={<Gesture />}
           variant="contained"
           //onClick={saveMeme}
           color="secondary"
           disabled
       >
         Draw your own
       </Button>

       <TextField name="url" className ="modal" id="standard-basic" label="Load Image from URL" onChange={handleChange} onKeyPress={handleSubmit}/>



     </div>
   </Modal>
      </div>
  );
}

export default ImageSelection;
