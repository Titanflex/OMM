
import React, { useState, useRef } from 'react';

import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { CloudDownload, FolderOpen, Gesture, LocalHospitalTwoTone } from "@material-ui/icons";
import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";



import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";


import Camera from "../ImageSelection/Camera";
import Paint from "../ImageSelection/Paint";


import "./../../css/ImageSelection/imageSelection.css";

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

  const fileField = useRef(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [url, setUrl] = useState((''));
  const [files, setFiles] = useState([]);

  /*const handleUpload = (event) =>{
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUrl(reader.result)
      console.log(url);
      params.setMemes([{url: url}]);
      handleClose();
    }
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
  }*/

  async function handleUpload(event) {
    const files = Array.from(event.target.files);
    //console.log("files:", files[0].name)
    const input = document.getElementById('fileUploaded');

    //const file = fileField.files[0];
    const formData = new FormData();
    formData.append(files[0].name, event.target.files[0]);
    //console.log(formData);
    await fetch("http://localhost:3030/memeIO/upload", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    }).then((res) => {
      //console.log(res.body);
      //TODO implement upload
      //console.log('not working yet')
    });
  }

  const handleChange = ({ target }) => {
    setUrl((prev) => target.value);
  }
  const handleSubmit = (event) => {
    if (event.key === 'Enter') {

      params.setMemes([{ url: url }]);
      event.preventDefault();
      handleClose()
    }
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
      }),
    }).then((res) => {
      let response = res.text();
      return response;
    }).then((data) => {
      console.log("data: " + data);
      handleClose();
    });
  }

  async function getMoreMemes() {
    const res = await fetch("https://api.imgflip.com/get_memes");
    const json = await res.json();
    params.setMemes(json.data.memes);
    handleClose();
  }

  function showOwnTemplate(response) {
    console.log(response)
    params.setMemes([{ upper: "test", lower: "one", url: response }])
    handleClose();
  }

  return (
    <div>
      <Button
        className="classes.buttonStyle"
        variant="contained"
        color="secondary"
        onClick={handleOpen}>
        I want more memes!
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">

        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Select your image</h2>

          {/*<label htmlFor="fileUploaded" className="custom-file-upload" color="secondary">
         <FolderOpen /> upload your own
       </label>
       <input  id="fileUploaded" type="file" name="sampleFile" onChange={handleUpload}/>*/}
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
            startIcon={<CloudDownload />}
            variant="contained"
            onClick={() => { getMoreMemes() }}
            color="secondary"
          >
            Get Images form ImageFlip

       </Button>
          <Camera />
          <Paint />
          <TextField
            name="url"
            className="modal"
            label="Load Image from URL"
            onChange={handleChange}
            onKeyPress={handleSubmit} />
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
