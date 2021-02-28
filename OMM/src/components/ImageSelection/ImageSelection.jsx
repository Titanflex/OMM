import React, {useState, useEffect} from 'react';

import Modal from '@material-ui/core/Modal';
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import {CloudDownload, StarBorder, Star} from "@material-ui/icons";
import {FilePond, registerPlugin} from "react-filepond";
import {Grid, GridList, GridListTile, GridListTileBar, IconButton} from "@material-ui/core";

import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import Camera from "../ImageSelection/Camera";
import Paint from "../ImageSelection/Paint";
import URL from "../ImageSelection/URL";

import AuthService from "../../services/auth.service";

import "./../../css/ImageSelection/imageSelection.css";

// Register the plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode);

//align modal in center of screen
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
    icon: {
        color: 'white',
    },
}));


const ImageSelection = params => {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [files, setFiles] = useState([]);
    const [templates, setTemplates] = useState([]);


    //open and close modal overlay
    const handleOpen = () => {
        loadTemplate();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    /**
     * update Templates in MemeCreator every time the templates in the ImageSelection is updated
     */
    useEffect(() => {
            if (templates.length > 0) {
                params.setTemplates(templates);
            }
        },
        [templates],
    );

    /**
     * Loads templates from server/db asynchronously
     */
    async function loadTemplate() {
        params.setCurrentTemplateIndex(0)
        const res = await fetch("http://localhost:3030/memeIO/get-templates");
        const json = await res.json();
        if (json.docs.length > 0) {
            params.setTemplates(json.docs);
            setTemplates(json.docs)
        } else {
            setTemplates(params.memeTemplates)
        }
    }

    /**
     * changes the shown template in the generator to the given tempalte template
     * @param {object} template 
     */
    function changeShownTemplate(template) {
        addUsedTemplate(template);
        if (params.isFreestyle) {
            params.setSelectedImage({url: template.url})
        }
        params.setCurrentTemplateIndex(params.memeTemplates.findIndex(function (item) {
            return item._id === template._id
        }))
        handleClose();
    }


    function addTemplates(image) {
        addUsedTemplate(image);
        params.setSelectedImages(image);
        handleClose();
    }

    /**
     * adds the given template to the template state
     * @param {object} newTemplate 
     */
    function addNewTemplates(newTemplate) {
        setTemplates(templates => [newTemplate, ...templates])
        setFiles([]);
    }

    /**
     * 
     * @param {object} template 
     */
    async function addUsedTemplate(template) {
        await fetch("http://localhost:3030/memeIO/add-used-template", {
            method: "POST",
            mode: "cors",
            headers: AuthService.getTokenHeader(),
            body: JSON.stringify({
                id: template._id,
                date: Date.now(),
            }),
        }).then((response) => {
            console.log(response);

        });
    }

    async function setLike(template) {
        await fetch("http://localhost:3030/memeIO/like-template", {
            method: "POST",
            mode: "cors",
            headers: AuthService.getTokenHeader(),
            body: JSON.stringify({
                id: template._id,
                date: Date.now(),
            }),
        }).then((response) => {
            console.log(response);

        });
    }

    async function removeLike(template) {
        await fetch("http://localhost:3030/memeIO/remove-like-template", {
            method: "POST",
            mode: "cors",
            headers: AuthService.getTokenHeader(),
            body: JSON.stringify({
                id: template._id
            }),
        }).then((response) => {
            console.log(response);
        });

    }

    /**
     * returns the templates in a grid list
     * @param {array} showtemplates 
     */
    const ShowTemplates = ({showtemplates}) => (
        <GridList cellHeight={180} className={classes.gridList} cols={3} style={{height: 450}}>
            {showtemplates.map((template) => (
                <GridListTile key={template.id} style={{'cursor': 'pointer'}} cols={template.cols || 1}
                              onClick={() => {
                                  if (params.isFreestyle) {
                                      addTemplates(template)
                                  } else {
                                      changeShownTemplate(template)
                                  }
                              }}

                >
                    <img src={template.url} alt={(template.name) ? template.name : template.templateName}/>
                    <GridListTileBar
                        title={(template.name) ? template.name : template.templateName}
                        titlePosition="top"
                        actionIcon={
                            <IconButton aria-label={`star ${template.name}`} className={classes.icon}
                                        onClick={() => {
                                            console.log(template);
                                            if (template.hasOwnProperty('likes') && (template.likes.some(like => like.user === localStorage.user))) {
                                                removeLike(template)
                                            } else {
                                                setLike(template)
                                            }
                                        }}>
                                {(template.hasOwnProperty('likes') && (template.likes.some(like => like.user === localStorage.user))) ?
                                    <Star/> : <StarBorder/>}
                            </IconButton>
                        }
                    />
                </GridListTile>
            ))
            }
        </GridList>
    );



    /**
     * sends new image to server and receives created template
     *
     * @param {String} title The title of the template
     * @param {String} src The url of the template
     * @param {boolean} internetSource Is true for images directly downloaded from user provided URL
     */
    async function saveTemplate(title, src, internetSource) {
        fetch("http://localhost:3030/memeIO/save-template", {
            method: "POST",
            mode: "cors",
            headers: AuthService.getTokenHeader(),
            body: JSON.stringify({
                internetSource: internetSource,
                title: title,
                url: src,
            }),
        }).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            if(data.message){
                alert("A template with this URL already exists");
                return;
            }
            addNewTemplates(data)
        });
    }

    /**
     * fetches templates with imageflip API
     */
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
            {/*Button visbile in MemeCreator which opens imageSelection modal*/}
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
                        {/*Template overview*/}
                        <Grid item xs={6}>
                            <h2 style={{marginBottom: "32px"}} id="simple-modal-title">Select a template to work on</h2>
                            <ShowTemplates showtemplates={templates}/>
                        </Grid>
                        <Grid item xs={6} style={{maxWidth: 400, marginLeft: 32, overflow: "auto", maxHeight: 520}}>
                            <div>
                                {/*Upload methods*/}
                                <h4 style={{marginBottom: "32px", marginTop: "32px"}}>Get or create more templates</h4>
                                <FilePond
                                    files={files}
                                    instantUpload={false}
                                    onupdatefiles={setFiles}
                                    server={{
                                        url: "http://localhost:3030/memeIO",
                                        process: {
                                            url: '/upload-Template',
                                            method: 'POST',
                                            headers: {
                                                'x-auth-token': localStorage.token,
                                                'templateName': "test"
                                            },
                                            onload: (response) => {
                                                let json = JSON.parse(response);
                                                if (json.message) {
                                                    alert(json.message);
                                                } else {
                                                    addNewTemplates(json);
                                                }
                                            }

                                        }
                                    }}
                                    name="file"
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />
                                <Button
                                    className="classes.buttonStyle modal"
                                    startIcon={<CloudDownload/>}
                                    variant="contained"
                                    onClick={() => {
                                        getTemplatesFromImgFlip()
                                    }}
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
                                <URL handleSave={saveTemplate}
                                addTemplate={addNewTemplates}/>

                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        </div>
    );
}

export default ImageSelection;
