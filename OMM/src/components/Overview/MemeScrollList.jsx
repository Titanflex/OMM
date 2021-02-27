import React, { useState, useEffect, } from "react";
import {
    Grid,
    TextField,
    Container,
    makeStyles,
    IconButton,
    Select,
    FormControl,
    InputLabel,
    Typography,
    Button,
    Modal,
    FormControlLabel,
    Checkbox,
    Snackbar,

} from "@material-ui/core";

import { ToggleButton, Alert } from "@material-ui/lab";

import {
    Tune,
    ArrowDownward,
    ArrowUpward,
} from '@material-ui/icons';

import Moment from 'moment';

import "./../../css/Overview/scrolllist.css";

import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import MemeView from "./MemeView";
import Filter from "./Filter";

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
    spacing: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
        
        formControl: {
          marginTop: theme.spacing(1),
          marginRight: theme.spacing(2),
        },
        paper: {
          position: "absolute",
          width: `${50}%`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
        },
        numberField: {
          width: `${15}%`,
          marginTop: theme.spacing(1),
          marginRight: theme.spacing(2),
        },
        filterButton: {
          height: `${70}%`,
          marginTop: theme.spacing(2),
          marginRight: theme.spacing(2),
        },
      

}));



function MemeScrollList() {

    const [memes, setMemes] = useState([{ caption: Array(0), tags: Array(0), _id: "5fdf7a7a65f604350c20b629", upper: "Uploading the group task before deadline", lower: "Uni2work NOT working" }]);
    const [originalMemes, setOriginalMemes] = useState([{ caption: Array(0), tags: Array(0), _id: "5fdf7a7a65f604350c20b629", upper: "Uploading the group task before deadline", lower: "Uni2work NOT working" }]);

    const [sortOpt, setSortOpt] = useState(null);
    const [sortDown, setSortDown] = useState(false);

    const [open, setOpen] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);

    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();




    //handels open and close of Modal
    const handleOpen = () => {
        setOpen(true);
        setMemes(originalMemes);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //handels open and close of SnackBar
    const handleOpenSnack = () => {
        setOpenSnack(true);
    };

    const handleCloseSnack = () => {
        setOpenSnack(false);
    };


    /*Sort*/
      /*
   The method handleSortOptChange is called when the user changes the value.
   It then calls the method which sorts the memes based on the selected value.
   */
    const handleSortOptChange = (event) => {
        setSortOpt(event.target.value);
        if (event.target.value === "votes") {
            sortMemesByVote();
        } else if (event.target.value === "creationDate") {
            sortMemesByDate();
        }
    }

    /*
    The method handleClickSortDirection is called when the user clicks the arrow button in order to change the direction of the sorted memes (e.g. many to few).
    It then calls the method which sorts the memes based on the value in the select menu.
    */
    const handleClickSortDirection = () => {
        setSortDown(!sortDown);
        if (sortOpt === "votes") {
            sortMemesByVote();
        } else if (sortOpt === "creationDate") {
            sortMemesByDate();
        }
    }
/*
    The method sortMemesByVote is called when the user changes the Sort by value or the direction.
    It take the direction and by that arranges the memelist by that direction and vote.
    It sets the currentMemeIndex to the first meme of the new arranged list.
    */
    const sortMemesByVote = () => {
        if (!sortDown) {
            memes.sort((memeA, memeB) => ((memeA.listlikes.length - memeA.dislikes.length ) - (memeB.listlikes.length - memeB.dislikes.length )));
        } else {
            memes.sort((memeA, memeB) => ((memeB.listlikes.length  - memeB.dislikes.length ) - (memeA.listlikes.length  - memeA.dislikes.length )));
        }
    }

    /*
    The method sortMemesByDate is called when the user changes the Sort by value or the direction.
    It take the direction and by that arranges the memelist by that direction and date.
    It sets the currentMemeIndex to the first meme of the new arranged list.
    */
    const sortMemesByDate = () => {
        if (!sortDown) {
            memes.sort((memeA, memeB) => (Moment(memeA.creationDate) - Moment(memeB.creationDate)));
        } else {
            memes.sort((memeA, memeB) => (Moment(memeB.creationDate) - Moment(memeA.creationDate)));
        }
    }



    /* Search*/
     /*
    The method handleChange is called when the textfield value of the searchbar changes.
    It takes the writtem text and checks if it is included in the title of the memes.
    It updates Memes by the filltered list and sets the index to the first image.
    When no meme fulfills the filter criteria the snackbar with a warning is opened and the memes is not updated.
    */
    const handleChange = () => (event) => {
        let filteredList = originalMemes;

        if (event.target.value !== "") {
            filteredList = originalMemes.filter(meme => {
                return meme.title.toLowerCase().includes(event.target.value.toLowerCase());
            })
        }
        if (filteredList.length === 0) {
            handleOpenSnack();
            console.log("no memes");
        }
        setMemes(filteredList);
    };

    //Lists all memes
    const ListMemes = ({ listmemes }) => {
        return (
            <Grid container spacing={1}>
                {
                    listmemes.map((meme) => (
                        <MemeView memeInfo={meme} getUpdatedMemes={loadMemes} key={meme._id} />
                    ))}
            </Grid>
        )
    };

      /*
   The method loadMemes gets all public memes from the server.
   It takes the index of the selected meme and therefore changes the currentMemeIndex to show at the beginning the right meme.
   */
    const loadMemes = async () => {
        await fetch("http://localhost:3030/memeIO/get-public-memes").then(res => {
            res.json().then(json => {
                setMemes(json.docs);
                setOriginalMemes(json.docs);
                console.log(json.docs)
                return json;
            })
        })
    };

    useEffect(() => {
        loadMemes();
    }, []);


    return (
        <Container className="memeScrollListContainer" >
            <Grid container spacing={3}>
                <Grid item xs>
                   
                </Grid>
                <Grid item xs={4}>
                    <div className="search-container">
                        <form>
                            <TextField
                                className="SearchTextField"
                                id="search"
                                label="Search Meme"
                                placeholder="Search Meme"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                onChange={handleChange()}
                            />
                        </form>
                    </div>
                </Grid>
                <Grid item xs>
                <Button
            onClick={handleOpen}
            className={classes.filterButton}
            variant="outlined"
            edge="end"
            size="medium"
            startIcon={<Tune />}
          >
            Filter
          </Button>
          <Filter 
           open={open}
           handleFilterClose={handleClose}
           memes= {memes}
           setMemes={setMemes}
           handleOpenSnack={handleOpenSnack}
           />
        
          <Snackbar
            open={openSnack}
            autoHideDuration={6000}
            onClose={handleCloseSnack}
          >
            <Alert onClose={handleCloseSnack} severity="error">
              No memes
            </Alert>
          </Snackbar>
          <FormControl variant="outlined" className={classes.spacing}>
            <InputLabel htmlFor="outlined-format-native-simple">
              Sort by
            </InputLabel>
            <Select
              native
              label="Sort by"
              id="select-Sort-Option"
              value={sortOpt}
              onChange={handleSortOptChange}
            >
              <option value={"none"}>None</option>
              <option value={"votes"}>Votes</option>
              <option value={"creationDate"}>Creation Date</option>
            </Select>
          </FormControl>

          <ToggleButton
            className={classes.filterButton}
            value="check"
            onChange={() => {
              handleClickSortDirection();
            }}
          >
            {" "}
            {sortDown ? <ArrowUpward /> : <ArrowDownward />}
          </ToggleButton>
                </Grid>

            </Grid>
            <Grid container spacing={1}>
                <ListMemes className={classes.spacing} listmemes={memes} />
            </Grid>
        </Container >
    );
}


export default MemeScrollList;