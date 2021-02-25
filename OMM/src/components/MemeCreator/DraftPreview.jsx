import React, {useState, useRef, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {GridList, GridListTile, GridListTileBar} from "@material-ui/core";




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


const DraftPreview = params => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);


    const handleClose = () => {
        setOpen(false);
        params.setPreview(false);
    };

    useEffect(()=> {
        setOpen(params.preview);
        console.log(params.docs);
    }, [params.preview]);

    const selectDraft = (index) => {
        console.log(index);
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
                                <GridListTile key={draft.id} style={{ 'cursor': 'pointer' }} cols={draft.cols || 1}
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
