import React, {useState, useRef, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {GridList, GridListTile, GridListTileBar} from "@material-ui/core";

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
    paper: {
        position: 'absolute',
        width: 564,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

/**
 * component for selecting a draft to continue
 * @param params, set MemeCreator component
 * @returns {JSX.Element}
 */
const DraftPreview = params => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);


    //closeModal
    const handleClose = () => {
        params.setPreview(false);
    };

    //open/close modal every time preview is loaded/draft is selected
    useEffect(()=> {
        setOpen(params.preview);
    }, [params.preview]);

    //update index of selected draft in memeCreator
    const selectDraft = (index) => {
        params.setDraftIndex(index);
        handleClose();
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <div style={modalStyle} className={classes.paper} >
                    <div style={{maxHeight: window.innerHeight-100, overflow:"auto"}}>
                        <GridList cellHeight={180} className={classes.gridList} cols={3} style={{ height: 450 }}>
                            {params.drafts.map((draft, index) => (
                                <GridListTile key={draft.url} style={{ 'cursor': 'pointer' }} cols={draft.cols || 1}
                                              onClick={() => selectDraft(index)}
                                >
                                    <img src={draft.preview} alt={draft.creationDate} />
                                    <GridListTileBar
                                        titlePosition="top"
                                    />
                                </GridListTile>
                            ))
                            }
                        </GridList >
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default DraftPreview;
