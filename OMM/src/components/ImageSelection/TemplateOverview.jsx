import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import { Grid, GridList, GridListTile, GridListTileBar } from "@material-ui/core";



import "./../../css/ImageSelection/imageSelection.css";


function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        position: 'fixed',
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    }
};


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 700,
        height: 600,
    },
    paper: {
        position: 'absolute',
        width: 700,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


const TemplateOverview = params => {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function changeMeme(image) {
        params.setCurrentMemeIndex(params.memeTemplates.findIndex(function (item, i) {
            return item.name === image.name
        }))
        handleClose();
    }


    const ShowTemplates = ({ showtemplates }) => (
        <GridList cellHeight={180} className={classes.gridList} cols={3}>
            {showtemplates.map((tile) => (
                < GridListTile key={tile.name} cols={tile.cols || 1}
                    onClick={() => { changeMeme(tile) }}
                >
                    <img src={tile.url} alt={(tile.name)?tile.name:tile.templateName} />
                    <GridListTileBar
                        title={(tile.name)?tile.name:tile.templateName}
                        titlePosition="top"
                    />
                </GridListTile>
            ))
            }
        </GridList >
    );

    return (
        <div>
            <Button
                className="classes.buttonStyle modal"
                variant="contained"
                color="secondary"
                onClick={handleOpen}>
                Template Overview
      </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <div style={modalStyle} className={classes.paper}>
                    <Grid container spacing={4}>
                        <h2 id="simple-modal-title">Select a template to work on</h2>

                        <ShowTemplates showtemplates={params.memeTemplates} />
                    </Grid>
                </div>
            </Modal>
        </div>
    );
}

export default TemplateOverview;
