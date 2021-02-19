
import React, { useState, useEffect } from 'react';

import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { CloudDownload } from "@material-ui/icons";
import { FilePond, registerPlugin } from "react-filepond";
import { Grid, GridList, GridListTile, GridListTileBar } from "@material-ui/core";



import "filepond/dist/filepond.min.css";



import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";


import Camera from "../ImageSelection/Camera";
import Paint from "../ImageSelection/Paint";
import URL from "../ImageSelection/URL";


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
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 1024,
    height: 580,
  },
}));

const ImageSelection = params => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = useState([]);
  const [templates, setTemplates] = useState([]);


  const handleOpen = () => {
    loadTemplate();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log(templates);
    },
    [templates],
  );

  async function loadTemplate() {
    params.setCurrentTemplateIndex(0)
    const res = await fetch("http://localhost:3030/memeIO/get-templates");
    const json = await res.json();
    if(json.docs.length > 0) {
      console.log(json.docs)
      params.setTemplates(json.docs);
      setTemplates(json.docs)
    } else {
      setTemplates(params.memeTemplates)
    }
    //handleClose();
  }

  function changeShownTemplate(image) {
    if (params.isFreestyle) {
      params.setSelectedImage({ url: image.url })
    } 
   params.setCurrentTemplateIndex(params.memeTemplates.findIndex(function (item) {
       return item._id === image._id
     }))
    handleClose();
  }

  function addTemplates(image) {
    params.setSelectedImages(image);
    handleClose();
  }

  function addNewTemplates(newTemplate) {
    setTemplates(templates => [newTemplate, ...templates])
    params.setTemplates(templates);
    setFiles([]);
    //handleClose();
  }

  const ShowTemplates = ({ showtemplates }) => (
    <GridList cellHeight={180} className={classes.gridList} cols={3} style={{height: 450}}>
      {showtemplates.map((template) => (
        <GridListTile key={template.id} style={{'cursor': 'pointer'}} cols={template.cols || 1}
          onClick={() => {
            if (params.isFreestyle) {
              addTemplates(template)
            } else { changeShownTemplate(template) }
          }}
        >
          <img src={template.url} alt={(template.name) ? template.name : template.templateName} />
          <GridListTileBar
            title={(template.name) ? template.name : template.templateName}
            titlePosition="top"
          />
        </GridListTile>
      ))
      }
    </GridList >
  );




  async function saveTemplate(title, src, internetSource) {
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
      return res.json();
    }).then((data) => {
      console.log(data)
      addNewTemplates(data);
    });
  }


  async function getTemplatesFromImgFlip() {
    const res = await fetch("https://api.imgflip.com/get_memes");
    const json = await res.json();
    params.setCurrentTemplateIndex(0)
    json.data.memes.map(meme => {
       meme._id = meme.id
     });
    setTemplates(templates.concat(json.data.memes));
    params.setTemplates(templates.concat(json.data.memes));
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
          <Grid container spacing={1}>
          <Grid item xs={6} >
              <h2 style={{marginBottom: "32px"}} id="simple-modal-title">Select a template to work on</h2>
              <ShowTemplates showtemplates={templates} />
            </Grid>
          <Grid item xs={6} style={{maxWidth: 400, marginLeft: 32}}>
          <div>
            <h4 style={{marginBottom: "32px", marginTop: "32px"}}>Get or create more templates</h4>
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
                    addNewTemplates(response)

                }
              }}
              name="file"
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />
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
            <URL handleSave={addNewTemplates}/>
      
          </div>
          </Grid>
          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default ImageSelection;
