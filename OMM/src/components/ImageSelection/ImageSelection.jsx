
import React, { useState } from 'react';

import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { CloudDownload } from "@material-ui/icons";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";



import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";


import Camera from "../ImageSelection/Camera";
import Paint from "../ImageSelection/Paint";


import "./../../css/ImageSelection/imageSelection.css";
import LoadIcon from "@material-ui/icons/Refresh";

// Register the plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode);



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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [url, setUrl] = useState((''));
  const [files, setFiles] = useState([]);



  const handleChange = ({ target }) => {
    setUrl((prev) => target.value);
  }
  const getTemplateFromURL = (event) => {
    if (event.key === 'Enter') {
      saveTemplate("title", url, true);
    }
  }
  async function loadTemplate() {
    const res = await fetch("http://localhost:3030/memeIO/get-templates");
    const json = await res.json();
    params.setTemplates(json.docs);
    handleClose();
  }

  function showOwnTemplate(response) {
    console.log(response)
    params.setTemplates([{ url: response }])
    handleClose();
  }

  async function handleScreenshot() {
    await fetch("http://localhost:3030/memeIO/webshot", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        author: localStorage.user
      }),
    }).then((res) => {
      return res.text();
    }).then((data) => {
      showOwnTemplate(data);
    });
  }

  async function saveTemplate(title, src, internetSource) {
    console.log(title);
    fetch("http://localhost:3030/memeIO/save-template", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        internetSource: internetSource,
        author: localStorage.user,
        title: title,
        url: src,
      }),
    }).then((res) => {
      return res.text();
    }).then((data) => {
      showOwnTemplate(data);
    });
  }


  async function getTemplatesFromImgFlip() {
    const res = await fetch("https://api.imgflip.com/get_memes");
    const json = await res.json();
    params.setTemplates(json.data.memes);
    handleClose();
  }

  function showOwnTemplate(response) {
    if(params.isFreestyle){
      params.setSelectedImage({url: response})
    }else{
      params.setTemplates([{url: response}])
    }
    setFiles([]);
    handleClose();
  }

  return (
    <div>
      <Button
        className="classes.buttonStyle modal"
        variant="contained"
        color="secondary"
        onClick={handleOpen}>
        I want more templates!
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">

        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Select your image</h2>

          <FilePond
            files={files}
            onupdatefiles={setFiles}
            server={{
              url: "http://localhost:3030/memeIO",
              process: {
                url: '/upload',
                method: 'POST',
                headers: {
                  'author': localStorage.user,
                  'templateName': "test"
                },
                onload: (response) =>
                  showOwnTemplate(response)

              }
            }}
            name="file"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
          <Button
            className="classes.buttonStyle modal"
            startIcon={<LoadIcon />}
            variant="contained"
            onClick={loadTemplate}
            color="secondary"
          >
            Load
          </Button>
          <Button
            className="classes.buttonStyle modal"
            startIcon={<CloudDownload />}
            variant="contained"
            onClick={() => { getTemplatesFromImgFlip() }}
            color="secondary"
          >
            Get Images form ImageFlip

       </Button>
          <Camera
            handleSave={saveTemplate}
          />
          <Paint
            handleSave={saveTemplate}
          />
          <TextField
            name="url"
            className="modal"
            label="Load Image from URL"
            onChange={handleChange}
            onKeyPress={getTemplateFromURL} />
          <TextField
            name="url"
            className="modal"
            label="Screenshot Image from URL"
            onChange={handleChange}
            onKeyPress={handleScreenshot} />
        </div>
      </Modal>
    </div>
  );
}

export default ImageSelection;
